import { apiRequest } from '@/shared/api/httpClient';
import type { Product } from '../types';

export const productsApi = {
  list: () => apiRequest<Product[]>('/products'),
  getById: (id: string) => apiRequest<Product>(`/products/${id}`),
};
