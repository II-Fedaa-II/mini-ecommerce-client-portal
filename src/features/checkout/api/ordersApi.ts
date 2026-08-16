import { apiRequest } from '@/shared/api/httpClient';
import type { Order, PaginatedOrders } from '../types';

export const ordersApi = {
  placeOrder: (idempotencyKey: string) =>
    apiRequest<Order>('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  getById: (id: string) => apiRequest<Order>(`/orders/${id}`),
  listMine: (page: number, limit: number) =>
    apiRequest<PaginatedOrders>(`/orders/me?page=${page}&limit=${limit}`),
};
