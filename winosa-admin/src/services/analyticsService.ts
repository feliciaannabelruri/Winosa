import api from './api';
import { Analytics, ApiResponse, Contact } from '../types';
import { exportToCSV } from '../utils/exportToCSV';

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

  exportFromData: (contacts: Contact[]) => {
    exportToCSV(contacts, [
      { label: 'Name',    key: 'name' },
      { label: 'Email',   key: 'email' },
      { label: 'Subject', key: 'subject' },
      { label: 'Message', key: 'message' },
      {
        label: 'Status',
        key: 'isRead',
        format: (val) => (val ? 'Read' : 'Unread'),
      },
      {
        label: 'Received At',
        key: 'createdAt',
        format: (val) =>
          new Date(String(val)).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
          }),
      },
    ], 'winosa-contacts');
  },
};