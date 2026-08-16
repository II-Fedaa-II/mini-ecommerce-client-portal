import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartKeys } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { productKeys } from '@/features/products/hooks/useProducts';
import { ordersApi } from '../api/ordersApi';
import type { OrderHistoryQuery } from '../types';

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idempotencyKey: string) => ordersApi.placeOrder(idempotencyKey),
    onSuccess: () => {
      // Checkout clears the cart and decrements stock server-side, so both
      // caches are stale the moment the order succeeds.
      queryClient.setQueryData(cartKeys.all, { items: [], total: 0 });
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useOrder(id: string) {
  const { can } = useAuth();
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: Boolean(id) && can(PERMISSIONS.ORDERS_READ_OWN),
  });
}

export function useOrderHistory(query: OrderHistoryQuery) {
  const { can } = useAuth();
  return useQuery({
    queryKey: ['orders', 'mine', query],
    queryFn: () => ordersApi.listMine(query),
    enabled: can(PERMISSIONS.ORDERS_READ_OWN),
    placeholderData: keepPreviousData,
  });
}
