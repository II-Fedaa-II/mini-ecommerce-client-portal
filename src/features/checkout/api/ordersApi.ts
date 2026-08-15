import { apiRequest } from '@/shared/api/httpClient';
import type { Order } from '../types';

export const ordersApi = {
  placeOrder: () => apiRequest<Order>('/orders', { method: 'POST' }),
  getById: (id: string) => apiRequest<Order>(`/orders/${id}`),
};
