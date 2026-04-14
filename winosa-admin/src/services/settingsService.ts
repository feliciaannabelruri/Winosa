import api from './api';
import { ApiResponse } from '../types';

export interface SiteSettings {
  _id?:       string;
  updatedAt?: string;

  // General 
  siteName:    string;
  siteTagline: string;
  logo?:       string;   
  favicon?:    string;   

  // SEO 
  metaTitle:         string;
  metaDescription:   string;
  metaKeywords:      string;
  googleAnalyticsId: string;

  // Social
  socialInstagram: string; 
  socialFacebook:  string;  
  socialLinkedin:  string;  
  socialYoutube:   string;  
  socialWhatsapp:  string;  

  // Contact 
  siteEmail:   string;
  sitePhone:   string;  
  siteAddress: string;  
}

export const settingsService = {
  get: async () => {
    const res = await api.get<ApiResponse<SiteSettings>>('/admin/settings');
    return res.data;
  },

  update: async (formData: FormData) => {
    const res = await api.put<ApiResponse<SiteSettings>>('/admin/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};