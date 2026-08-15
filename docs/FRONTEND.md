# Frontend — architecture notes

> **Write this section yourself, in your own words.** The assessment explicitly asks for
> these rationale docs to be written manually with no AI assistance. The headings and
> prompts below are only a checklist of what to cover — delete the prompts as you replace
> them with your own explanation.

## Why Vite + React Router (not Next.js)

<!-- Nothing here needs server rendering or server routing. Explain why a lean SPA was the
     right size for six pages, and what Next.js would have added that you would not use. -->

## Feature-based structure

<!-- src/features/{auth,products,cart,wishlist,checkout}, each owning its components,
     pages, hooks, API calls, mocks, and types. Explain why you grouped by feature rather
     than by file type, and how it mirrors the backend's module boundaries. -->

## State management

<!-- TanStack Query for everything server-owned (products, cart, wishlist, orders):
     caching, loading/error states, cache updates after mutations.
     AuthContext for the session. Local useState for ephemeral UI (selected variant).
     Explain why you did not reach for Redux. -->

## How loading, error, and empty states are handled

<!-- The assessment calls this out specifically. Explain the shared LoadingState /
     ErrorState / EmptyState components and how every page uses them. -->

## Token handling and why it is safe

<!-- Access token in module memory only, never localStorage.
     Refresh token in an httpOnly cookie the JS never sees.
     Silent refresh on app load; a 401 triggers one shared refresh-then-retry.
     Explain the trade-off: a brief "restoring session" state on hard refresh in exchange
     for XSS resistance. Why is the single-flight refresh important? -->

## Design system

<!-- Tailwind v4 theme tokens, flat solid colours with no gradients, Source Serif 4
     self-hosted as woff2 (no external font CDN). shadcn-style primitives (Button, Input)
     built on Radix. Explain the choices in your own words. -->

## Testing

<!-- Vitest + React Testing Library per feature, with MSW handlers owned by each feature
     and only aggregated in shared/test/mswServer.ts.
     One Playwright golden-path e2e against the real stack. Why one journey instead of a
     scenario matrix? -->
