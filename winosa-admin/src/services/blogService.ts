import api from './api';
import { Blog, PaginatedResponse, ApiResponse } from '../types';

export interface BlogPayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  image?: string;
  isPublished?: boolean;
}

export const blogService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isPublished?: boolean;
    author?: string;
  }) => {
    const response = await api.get<PaginatedResponse<Blog>>('/admin/blog', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Blog>>(`/admin/blog/${id}`);
    return response.data;
  },

  // JSON — image is pre-uploaded via /api/admin/upload
  create: async (payload: BlogPayload) => {
    const response = await api.post<ApiResponse<Blog>>('/admin/blog', payload);
    return response.data;
  },

  update: async (id: string, payload: BlogPayload) => {
    const response = await api.put<ApiResponse<Blog>>(`/admin/blog/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/blog/${id}`);
    return response.data;
  },
};