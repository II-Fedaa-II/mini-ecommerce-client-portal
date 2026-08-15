import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts() {
  return useQuery({ queryKey: productKeys.all, queryFn: productsApi.list });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: productKeys.detail(id), queryFn: () => productsApi.getById(id), enabled: Boolean(id) });
}
