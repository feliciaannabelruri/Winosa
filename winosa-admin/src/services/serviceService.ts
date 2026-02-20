import api from './api';
import { Service, ApiResponse } from '../types';

export const serviceService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; data: Service[] }>('/admin/services');
    return response.data;
  },

  create: async (data: Partial<Service>) => {
    const response = await api.post<ApiResponse<Service>>('/admin/services', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Service>) => {
    const response = await api.put<ApiResponse<Service>>(`/admin/services/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/services/${id}`);
    return response.data;
  },
};
