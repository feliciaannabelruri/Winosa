import api from './api';
import { ApiResponse } from '../types';

export interface SiteSettings {
  _id?: string;
  siteTitle: string;
  siteDescription: string;
  logo?: string;
  logoId?: string;
  favicon?: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  // Social Media
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  youtube: string;
  // Contact Info
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  // Extra
  googleAnalyticsId: string;
  updatedAt?: string;
}

export const settingsService = {
  get: async () => {
    const response = await api.get<ApiResponse<SiteSettings>>('/admin/settings');
    return response.data;
  },

  update: async (formData: FormData) => {
    const response = await api.put<ApiResponse<SiteSettings>>('/admin/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};