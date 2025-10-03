import { queryClient } from '@/shared/api/query-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token: string) => {
        // localStorage.setItem('auth_token', token);
        set({ token, isAuthenticated: true });
      },
      logout: () => {
        queryClient.clear();
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const getAuthStore = () => useAuthStore.getState();