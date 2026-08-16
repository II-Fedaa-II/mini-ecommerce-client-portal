import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import type { Product } from '@/features/products/types';
import { wishlistApi } from '../api/wishlistApi';

export const wishlistKeys = { all: ['wishlist'] as const };

export function useWishlist() {
  const { isAuthenticated, can } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: wishlistKeys.all,
    queryFn: wishlistApi.get,
    enabled: isAuthenticated && can(PERMISSIONS.WISHLIST_MANAGE),
  });

  const onWishlistResponse = (products: Product[]) => queryClient.setQueryData(wishlistKeys.all, products);

  const addItem = useMutation({ mutationFn: wishlistApi.addItem, onSuccess: onWishlistResponse });
  const removeItem = useMutation({ mutationFn: wishlistApi.removeItem, onSuccess: onWishlistResponse });

  const isInWishlist = (productId: string) => query.data?.some((product) => product.id === productId) ?? false;

  return {
    wishlist: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    addItem,
    removeItem,
    isInWishlist,
  };
}
