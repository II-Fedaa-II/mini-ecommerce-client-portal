import { apiRequest } from '@/shared/api/httpClient';
import type { Order, OrderHistoryQuery, PaginatedOrders } from '../types';

function toQueryString(query: OrderHistoryQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  if (query.dateFrom) params.set('dateFrom', query.dateFrom);
  if (query.dateTo) params.set('dateTo', query.dateTo);
  return `?${params.toString()}`;
}

export const ordersApi = {
  placeOrder: (idempotencyKey: string) =>
    apiRequest<Order>('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  getById: (id: string) => apiRequest<Order>(`/orders/${id}`),
  listMine: (query: OrderHistoryQuery) =>
    apiRequest<PaginatedOrders>(`/orders/me${toQueryString(query)}`),
};
