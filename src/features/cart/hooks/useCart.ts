import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { productKeys } from '@/features/products/hooks/useProducts';
import { cartApi } from '../api/cartApi';
import type { Cart } from '../types';

export const cartKeys = { all: ['cart'] as const };

export function useCart() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: cartKeys.all, queryFn: cartApi.get, enabled: isAuthenticated });

  // Every mutation returns the authoritative cart, so we seed the cache with the
  // response instead of triggering a second round-trip to refetch it.
  const onCartResponse = (cart: Cart) => queryClient.setQueryData(cartKeys.all, cart);

  const addItem = useMutation({ mutationFn: cartApi.addItem, onSuccess: onCartResponse });
  const updateItem = useMutation({ mutationFn: cartApi.updateItem, onSuccess: onCartResponse });
  const removeItem = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (cart) => {
      onCartResponse(cart);
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });

  return {
    cart: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    addItem,
    updateItem,
    removeItem,
  };
}
