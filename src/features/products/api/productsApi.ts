import { apiRequest } from '@/shared/api/httpClient';
import type { PaginatedProducts, Product, ProductListQuery } from '../types';

function toQueryString(query: ProductListQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.inStock) params.set('inStock', 'true');
  if (query.sort) params.set('sort', query.sort);

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export const productsApi = {
  list: (query: ProductListQuery = {}) =>
    apiRequest<PaginatedProducts>(`/products${toQueryString(query)}`),
  getById: (id: string) => apiRequest<Product>(`/products/${id}`),
};
