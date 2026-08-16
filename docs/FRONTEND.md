# Frontend — architecture notes

## Why Vite + React Router (not Next.js)

Nothing here needs server rendering, server-side data fetching, or file-based
routing — it's six-ish pages behind a login wall, all client-rendered, all
authenticated. Next.js's value is in SSR/SSG and the server/client component
split; none of that applies to an app where every page needs a signed-in
user's data anyway, so there's nothing to statically render. Vite gives a
fast dev server and a plain SPA build, and React Router gives just the
routing — that's the actual surface area this app needs, without carrying a
framework's server runtime for a use case that never touches it.

## Feature-based structure

`src/features/{auth,products,cart,wishlist,checkout}`, each owning its own
components, pages, hooks, API calls, MSW mocks, and types. A change to "how
checkout works" touches one folder, not a components folder, a hooks folder,
and an api folder scattered across the tree. It also mirrors the backend's
module boundaries conceptually — the client's `cart` feature and the
backend's `CartModule` are the same domain looked at from two sides, so
finding the frontend code for a given backend feature (or vice versa) is
just matching folder names.

## State management

TanStack Query owns everything server-derived — products, cart, wishlist,
orders. It handles caching, loading/error state, and cache invalidation
after mutations, which is the concrete mechanism behind "handle loading
states, edge cases": every page that fetches data gets `isLoading`/`isError`
for free instead of hand-rolled state. Mutations write their response
straight into the query cache on success rather than triggering a refetch —
placing an order, for instance, seeds the cart cache with the now-empty cart
the server just returned instead of firing a second round trip to confirm
it's empty.

Auth session (access token, user, role/permissions) lives in `AuthContext` —
it isn't server *cache*, it's the identity of the current session, which is
a different lifecycle than "data fetched from an endpoint." Anything
ephemeral and purely local — the variant currently selected on a product
page before it's added to the cart — stays local `useState`. I didn't reach
for Redux/Zustand because once server state is offloaded to React Query and
session state has its own context, there's no remaining cross-feature global
state that would need one — adding a store would just duplicate what React
Query already tracks.

## How loading, error, and empty states are handled

Three shared components — `LoadingState`, `ErrorState`, `EmptyState` — used
by every page that fetches data, so the same "loading spinner / retry button
/ nothing here yet" shape shows up consistently instead of each page
inventing its own. `ErrorState` takes the actual error message rather than a
hardcoded string: every page runs its query's error through an
`errorMessage(error, fallback)` helper that surfaces the backend's real
message (a 403's "Missing required permission: X", a 409's duplicate-email
message) and only falls back to generic copy when the failure isn't one the
API produced a message for (a dropped connection, for instance).

## Token handling and why it is safe

The access token lives in memory only (a module-level variable, not
`localStorage` or `sessionStorage`) — it's gone on a hard refresh. The
refresh token is an httpOnly cookie the JS on this page never sees at all.
On app load, a silent call to `/auth/refresh` (the cookie goes along
automatically) re-issues a fresh access token without the user re-entering
credentials. If any request gets a 401, the client refreshes once and
retries that request transparently.

The trade-off is a brief "restoring session" loading state on a hard
refresh, in exchange for real XSS resistance: an injected script can read
`localStorage`, but it can't read an httpOnly cookie, and there's no
long-lived token sitting in memory or storage for it to steal even if it
tried. The refresh call is single-flight (concurrent 401s share one
in-flight refresh promise rather than each firing their own) specifically
because the backend rotates the refresh token on every use — if two requests
each triggered their own refresh, the second one would be replaying a
token the first refresh had already rotated out, which the backend's reuse
detection would treat as theft and revoke the whole session for.

## Design system

Tailwind v4 theme tokens define the whole palette as flat, solid colors.
Fonts are self-hosted as woff2 rather than pulled from a font CDN at
runtime, so the page doesn't depend on a third party being up to render
correctly. Buttons/inputs follow a shadcn-style pattern — Radix primitives
underneath for the behavior that's easy to get subtly wrong by hand (focus
trapping, `aria-modal`, escape-to-close, restoring focus on dialog close),
styled with Tailwind on top.

## Testing

Vitest + React Testing Library per feature, with MSW handlers owned by
whichever feature they mock and only aggregated (not defined) in
`shared/test/mswServer.ts` — no feature's test data lives outside that
feature's own folder. One Playwright test covers the full golden path
(login → browse → detail → add to cart with a variant → adjust quantity →
wishlist → checkout → confirmation) against the real running stack, rather
than a scenario matrix of small e2e tests. A single comprehensive journey
catches integration bugs a unit test can't see (does the cart total actually
update after checkout clears it server-side), while the many small edge
cases — variant selection logic, cart quantity math, form validation — are
covered faster and more precisely at the unit level where they belong.
