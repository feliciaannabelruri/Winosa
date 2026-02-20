import api from './api';
import { ApiResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<User> & { token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
