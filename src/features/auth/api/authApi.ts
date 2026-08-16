import { apiRequest } from '@/shared/api/httpClient';
import type { LoginResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } }),

  register: (email: string, password: string, name: string) =>
    apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    }),

  logout: () => apiRequest<{ success: true }>('/auth/logout', { method: 'POST' }),
};
