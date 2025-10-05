import axios, { AxiosRequestConfig } from 'axios';
import { getAuthStore } from '@/features/auth/store';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // for httpOnly cookie
});

// --- Request interceptor: set access token from Zustand ---
apiClient.interceptors.request.use((config) => {
  const token = getAuthStore().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: for refresh ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token?: string) => void; reject: (err?: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await apiClient.get('/auth/refresh'); // cookie auto send

        const newToken = res.data?.accessToken;

        if (!newToken) throw new Error('No access token returned');

        // update new token in zustand
        getAuthStore().setToken(newToken);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        getAuthStore().logout();
        window.location.href = '/signup';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
