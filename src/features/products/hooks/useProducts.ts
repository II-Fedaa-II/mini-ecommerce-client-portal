import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import type { ProductListQuery } from '../types';

export const productKeys = {
  all: ['products'] as const,
  list: (query: ProductListQuery) => ['products', 'list', query] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts(query: ProductListQuery = {}) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productsApi.list(query),
    // Keeps the current page's cards on screen while the next page loads, instead of
    // flashing a loading state for every filter/page change.
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: productKeys.detail(id), queryFn: () => productsApi.getById(id), enabled: Boolean(id) });
}
