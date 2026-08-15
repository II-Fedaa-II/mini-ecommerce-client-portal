import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import type { AuthUser } from '../types';

export const mockUser: AuthUser = {
  id: 'user-1',
  email: 'demo@mini-ecommerce.test',
  name: 'Demo Customer',
};

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.password !== 'Password123!') {
      return HttpResponse.json({ statusCode: 401, message: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({ accessToken: 'mock-access-token', user: mockUser });
  }),

  // Unauthenticated by default — tests that need a live session log in explicitly.
  http.post(`${API_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),

  http.post(`${API_URL}/auth/logout`, () => HttpResponse.json({ success: true })),
];
