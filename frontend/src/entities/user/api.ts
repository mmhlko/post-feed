import { apiClient } from '@/shared/api/axios';
import { User, UpdateUserRequest } from './types';

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user');
    return response.data;
  },

  updateProfile: async (data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/user', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<User>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};
