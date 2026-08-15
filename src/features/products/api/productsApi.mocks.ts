import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'product-1',
    title: 'Classic Cotton T-Shirt',
    description: 'A breathable, everyday cotton t-shirt.',
    price: 19.99,
    stock: 42,
    variants: [
      { name: 'Size', options: ['S', 'M', 'L'] },
      { name: 'Color', options: ['Black', 'White'] },
    ],
  },
  {
    id: 'product-2',
    title: 'Ceramic Coffee Mug',
    description: '12oz ceramic mug, dishwasher safe.',
    price: 9.99,
    stock: 0,
    variants: [],
  },
];

export const productHandlers = [
  http.get(`${API_URL}/products`, () => HttpResponse.json(mockProducts)),
  http.get(`${API_URL}/products/:id`, ({ params }) => {
    const product = mockProducts.find((entry) => entry.id === params.id);
    return product ? HttpResponse.json(product) : new HttpResponse(null, { status: 404 });
  }),
];
