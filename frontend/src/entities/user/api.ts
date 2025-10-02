import { apiClient } from '@/shared/api/axios';
import { User, UpdateUserRequest } from './types';

export const userApi = {
  // Получение профиля по id
  getProfile: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${id}`);
    return response.data;
  },

  // Обновление профиля (PATCH /user/:id)
  updateProfile: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<User>(`/user/${id}`, data);
    return response.data;
  },

  // Загрузка аватара (POST /user/:id/avatar)
  uploadAvatar: async (id: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<User>(`/user/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};
