import type { Product } from '@/features/products/types';
import { apiRequest } from '@/shared/api/httpClient';

export const wishlistApi = {
  get: () => apiRequest<Product[]>('/wishlist'),
  addItem: (productId: string) => apiRequest<Product[]>(`/wishlist/${productId}`, { method: 'POST' }),
  removeItem: (productId: string) => apiRequest<Product[]>(`/wishlist/${productId}`, { method: 'DELETE' }),
};
