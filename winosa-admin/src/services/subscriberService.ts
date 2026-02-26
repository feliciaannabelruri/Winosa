import api from './api';
import { Subscriber, ApiResponse } from '../types';

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

  export: async () => {
    // Returns CSV or list of emails
    const response = await api.get<{ success: boolean; count: number; data: Subscriber[] }>('/newsletter');
    const emails = response.data.data.map((s: Subscriber) => s.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  },
};