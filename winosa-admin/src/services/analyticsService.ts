import api from './api';
import { Analytics, ApiResponse, Contact } from '../types';

export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get<ApiResponse<Analytics>>('/admin/analytics');
    return response.data;
  },
};

export const contactService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; data: Contact[] }>('/contact');
    return response.data;
  },
};
