import api from './api';
import { Portfolio, PaginatedResponse, ApiResponse } from '../types';

export const portfolioService = {
  getAll: async (params?: { page?: number; limit?: number; category?: string }) => {
    const response = await api.get<PaginatedResponse<Portfolio>>('/admin/portfolio', { params });
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post<ApiResponse<Portfolio>>('/admin/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.put<ApiResponse<Portfolio>>(`/admin/portfolio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/portfolio/${id}`);
    return response.data;
  },
};
