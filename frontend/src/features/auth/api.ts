import { apiClient } from '@/shared/api/axios';
import { getAuthStore } from './store';

export type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const authApi = {
  signup: async (data: SignupRequest) => {
    const res = await apiClient.post<{ user: Record<string, unknown>; accessToken: string }>('/auth/signup', data);
    return res.data;
  },

  login: async (data: LoginRequest) => {
    const res = await apiClient.post<{ user: Record<string, unknown>; accessToken: string }>('/auth/login', data);
    return res.data;
  },

  refresh: async () => {
    const res = await apiClient.get<{ accessToken: string }>('/auth/refresh');
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post<{ ok: boolean }>('/auth/logout');
    getAuthStore().logout();
    return res.data;
  },
};
