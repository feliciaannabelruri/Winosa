import api from './api';
import { PaginatedResponse, ApiResponse } from '../types';

// Extended Portfolio type dengan semua field baru
export interface Portfolio {
  _id:        string;
  title:      string;
  slug:       string;
  shortDesc:  string;
  description?: string;   // legacy fallback
  longDesc:   string;
  category:   string;
  client:     string;
  year:       string;
  duration:   string;
  role:       string;
  projectUrl: string;
  thumbnail:  string;
  image?:     string;     // legacy fallback
  heroImage:  string;
  techStack:  string[];
  challenge:  string;
  solution:   string;
  result:     string;
  metrics:    { value: string; label: string }[];
  gallery:    string[];
  isActive:   boolean;
  createdAt:  string;
  updatedAt:  string;
}

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

  // Sekarang kirim JSON bukan FormData
  create: async (payload: Omit<Portfolio, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<ApiResponse<Portfolio>>('/admin/portfolio', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Portfolio>) => {
    const response = await api.put<ApiResponse<Portfolio>>(`/admin/portfolio/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/portfolio/${id}`);
    return response.data;
  },
};