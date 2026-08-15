import { http, HttpResponse } from 'msw';
import { mockProducts } from '@/features/products/api/productsApi.mocks';
import { API_URL } from '@/shared/api/httpClient';

export const wishlistHandlers = [
  http.get(`${API_URL}/wishlist`, () => HttpResponse.json([mockProducts[0]])),
  http.post(`${API_URL}/wishlist/:productId`, () => HttpResponse.json([mockProducts[0]], { status: 201 })),
  http.delete(`${API_URL}/wishlist/:productId`, () => HttpResponse.json([])),
];
