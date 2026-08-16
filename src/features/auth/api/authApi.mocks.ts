import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/api/httpClient';
import { PERMISSIONS, type AuthUser } from '../types';

export const mockUser: AuthUser = {
  id: 'user-1',
  email: 'demo@mini-ecommerce.test',
  name: 'Demo Customer',
  role: { id: 'role-customer', name: 'customer', permissions: Object.values(PERMISSIONS) },
};

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.password !== 'Password123!') {
      return HttpResponse.json({ statusCode: 401, message: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({ accessToken: 'mock-access-token', user: mockUser });
  }),

  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email: string; name: string };

    if (body.email === mockUser.email) {
      return HttpResponse.json(
        { statusCode: 409, message: `An account with the email "${body.email}" already exists` },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      {
        accessToken: 'mock-access-token',
        user: { id: 'user-2', email: body.email, name: body.name, role: mockUser.role },
      },
      { status: 201 },
    );
  }),

  // Unauthenticated by default — tests that need a live session log in explicitly.
  http.post(`${API_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),

  http.post(`${API_URL}/auth/logout`, () => HttpResponse.json({ success: true })),
];
