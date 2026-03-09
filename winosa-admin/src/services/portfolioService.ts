import api from './api';
import { Portfolio, PaginatedResponse, ApiResponse } from '../types';

const formDataHeaders = { 'Content-Type': undefined as any };

export const portfolioService = {
  getAll: async (params?: { page?: number; limit?: number; category?: string }) => {
    const response = await api.get<PaginatedResponse<Portfolio>>('/admin/portfolio', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Portfolio>>(`/admin/portfolio/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Portfolio>>(`/portfolio/${slug}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<ApiResponse<Portfolio>>('/admin/portfolio', data, {
      headers: formDataHeaders,
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Portfolio>>(`/admin/portfolio/${id}`, data, {
      headers: formDataHeaders,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/portfolio/${id}`);
    return response.data;
  },
};