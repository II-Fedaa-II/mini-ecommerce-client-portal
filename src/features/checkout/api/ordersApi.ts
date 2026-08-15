import { apiRequest } from '@/shared/api/httpClient';
import type { Order } from '../types';

export const ordersApi = {
  placeOrder: (idempotencyKey: string) =>
    apiRequest<Order>('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  getById: (id: string) => apiRequest<Order>(`/orders/${id}`),
};
