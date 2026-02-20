// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  imageId?: string;
  author?: string;
  tags?: string[];
  isPublished: boolean;
  views: number;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  isPublished: boolean;
  image?: File;
}

// Portfolio Types
export interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  imageId?: string;
  category?: string;
  client?: string;
  projectUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioFormData {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  client?: string;
  projectUrl?: string;
  isActive: boolean;
  image?: File;
}

// Service Types
export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  features?: string[];
  price?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  icon?: string;
  features?: string[];
  price?: string;
  isActive: boolean;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Analytics Types
export interface Analytics {
  counts: {
    portfolios: number;
    blogs: number;
    services: number;
    subscribers: number;
    contacts: number;
  };
  recentBlogs: Array<{ title: string; slug: string; createdAt: string }>;
  popularBlogs: Array<{ title: string; slug: string; views: number }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

// Filter Types
export type BlogFilter = 'all' | 'published' | 'draft';
export type PortfolioFilter = 'all' | 'published' | 'draft';
