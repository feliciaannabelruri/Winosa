import api from './api';
import { ApiResponse } from '../types';

export interface SiteSettings {
  _id?:       string;
  updatedAt?: string;

  // General 
  siteName:    string;
  siteTagline: string;
  logo?:       string;   // URL after upload
  favicon?:    string;   // URL after upload

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
  socialWhatsapp:  string;  // digits only → wa.me/{number}

  // Contact 
  siteEmail:   string;
  sitePhone:   string;  // → SectionContactForm "Call us"
  siteAddress: string;  // → SectionContactForm "Visit us"
}

export const settingsService = {
  get: async () => {
    const res = await api.get<ApiResponse<SiteSettings>>('/admin/settings');
    return res.data;
  },

  /** Sends FormData to support logo */
  update: async (formData: FormData) => {
    const res = await api.put<ApiResponse<SiteSettings>>('/admin/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};