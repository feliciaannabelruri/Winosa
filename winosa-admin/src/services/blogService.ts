import api from './api';
import { Blog, PaginatedResponse, ApiResponse } from '../types';

export const blogService = {
  getAll: async (params?: { page?: number; limit?: number; isPublished?: boolean; author?: string }) => {
    const response = await api.get<PaginatedResponse<Blog>>('/admin/blog', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Blog>>(`/admin/blog/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post<ApiResponse<Blog>>('/admin/blog', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.put<ApiResponse<Blog>>(`/admin/blog/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/blog/${id}`);
    return response.data;
  },
};
