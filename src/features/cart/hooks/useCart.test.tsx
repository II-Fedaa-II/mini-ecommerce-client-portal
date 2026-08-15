import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useCart } from './useCart';

// The cart hook only fetches for a signed-in shopper, so the auth state is stubbed
// rather than driving a full login through the UI in every case.
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCart', () => {
  it('loads the cart with per-line subtotals and a total', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.cart).toBeDefined());

    expect(result.current.cart?.items).toHaveLength(1);
    expect(result.current.cart?.items[0].subtotal).toBe(39.98);
    expect(result.current.cart?.total).toBe(39.98);
  });

  it('writes the mutation response straight into the cache instead of refetching', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.cart).toBeDefined());

    await result.current.updateItem.mutateAsync({ itemId: 'item-1', quantity: 3 });

    await waitFor(() => expect(result.current.cart?.items[0].quantity).toBe(3));
    expect(result.current.cart?.total).toBeCloseTo(59.97, 2);
  });

  it('empties the cart when the last line is removed', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.cart).toBeDefined());

    await result.current.removeItem.mutateAsync('item-1');

    await waitFor(() => expect(result.current.cart?.items).toHaveLength(0));
    expect(result.current.cart?.total).toBe(0);
  });
});
