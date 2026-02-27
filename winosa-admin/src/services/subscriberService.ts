import api from './api';
import { Subscriber, ApiResponse } from '../types';
import { exportToCSV } from '../utils/exportToCSV';

export const subscriberService = {
  getAll: async (params?: { isActive?: boolean }) => {
    const response = await api.get<{ success: boolean; count: number; data: Subscriber[] }>(
      '/newsletter',
      { params }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/newsletter/${id}`);
    return response.data;
  },

  exportFromData: (subscribers: Subscriber[]) => {
    exportToCSV(subscribers, [
      { label: 'Email', key: 'email' },
      {
        label: 'Status',
        key: 'isActive',
        format: (val) => (val ? 'Active' : 'Inactive'),
      },
      {
        label: 'Subscribed At',
        key: 'createdAt',
        format: (val) =>
          new Date(String(val)).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
          }),
      },
    ], 'winosa-subscribers');
  },
};