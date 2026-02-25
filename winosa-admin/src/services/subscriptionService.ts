import api from './api';
import { Subscription, ApiResponse, PaginatedResponse } from '../types';

export const subscriptionService = {
  getAll: async (params?: { isActive?: boolean; duration?: 'monthly' | 'yearly' }) => {
    const response = await api.get<PaginatedResponse<Subscription>>('/admin/subscriptions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Subscription>>(`/admin/subscriptions/${id}`);
    return response.data;
  },

  create: async (data: Partial<Subscription>) => {
    const response = await api.post<ApiResponse<Subscription>>('/admin/subscriptions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Subscription>) => {
    const response = await api.put<ApiResponse<Subscription>>(`/admin/subscriptions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/subscriptions/${id}`);
    return response.data;
  },
};