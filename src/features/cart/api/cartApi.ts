import { apiRequest } from '@/shared/api/httpClient';
import type { AddToCartInput, Cart, UpdateCartItemInput } from '../types';

export const cartApi = {
  get: () => apiRequest<Cart>('/cart'),

  addItem: (input: AddToCartInput) => apiRequest<Cart>('/cart', { method: 'POST', body: input }),

  updateItem: ({ itemId, ...changes }: UpdateCartItemInput) =>
    apiRequest<Cart>(`/cart/${itemId}`, { method: 'PATCH', body: changes }),

  removeItem: (itemId: string) => apiRequest<Cart>(`/cart/${itemId}`, { method: 'DELETE' }),
};
