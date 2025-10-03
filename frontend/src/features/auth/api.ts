import { apiClient } from '@/shared/api/axios';

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginRequest = { email: string; password: string };

export const authApi = {
  async register(data: RegisterRequest) {
    const res = await apiClient.post('/auth/register', data, { withCredentials: true });
    return res.data as { user: Record<string, unknown>; accessToken: string };
  },
  async login(data: LoginRequest) {
    const res = await apiClient.post('/auth/login', data, { withCredentials: true });
    return res.data as { user: Record<string, unknown>; accessToken: string };
  },
  async refresh() {
    const res = await apiClient.get('/auth/refresh', { withCredentials: true });
    return res.data as { accessToken: string };
  },
  async logout() {
    const res = await apiClient.post('/auth/logout', {}, { withCredentials: true });
    return res.data as { ok: boolean };
  },
};