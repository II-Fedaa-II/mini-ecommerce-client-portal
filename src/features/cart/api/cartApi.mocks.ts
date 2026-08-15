import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import type { Cart } from '../types';

export const mockCart: Cart = {
  items: [
    {
      itemId: 'item-1',
      productId: 'product-1',
      title: 'Classic Cotton T-Shirt',
      price: 19.99,
      quantity: 2,
      selectedVariants: [{ name: 'Size', value: 'M' }],
      subtotal: 39.98,
    },
  ],
  total: 39.98,
};

export const emptyCart: Cart = { items: [], total: 0 };

export const cartHandlers = [
  http.get(`${API_URL}/cart`, () => HttpResponse.json(mockCart)),
  http.post(`${API_URL}/cart`, () => HttpResponse.json(mockCart, { status: 201 })),
  http.patch(`${API_URL}/cart/:itemId`, async ({ request }) => {
    const body = (await request.json()) as { quantity?: number };
    if (body.quantity === undefined) return HttpResponse.json(mockCart);

    const line = { ...mockCart.items[0], quantity: body.quantity, subtotal: 19.99 * body.quantity };
    return HttpResponse.json({ items: [line], total: line.subtotal });
  }),
  http.delete(`${API_URL}/cart/:itemId`, () => HttpResponse.json(emptyCart)),
];
