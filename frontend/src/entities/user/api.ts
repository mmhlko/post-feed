import { apiClient } from '@/shared/api/axios';
import { User, UpdateUserRequest } from './types';

export const userApi = {
  // Получение профиля по токену
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user');
    return response.data;
  },

  // Обновление профиля (PATCH /user/profile)
  updateProfile: async (data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/user', data);
    return response.data;
  },

  // Загрузка аватара (POST /user/profile/avatar)
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<User>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};
