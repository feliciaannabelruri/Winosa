import api from './api';
import { Blog, PaginatedResponse, ApiResponse } from '../types';

const formDataHeaders = { 'Content-Type': undefined as any };

export const blogService = {
  getAll: async (params?: { page?: number; limit?: number; isPublished?: boolean; author?: string }) => {
    const response = await api.get<PaginatedResponse<Blog>>('/admin/blog', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Blog>>(`/admin/blog/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<ApiResponse<Blog>>('/admin/blog', data, {
      headers: formDataHeaders,
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Blog>>(`/admin/blog/${id}`, data, {
      headers: formDataHeaders,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/blog/${id}`);
    return response.data;
  },
};