import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token + handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('winosa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, remove Content-Type so axios sets
    // multipart/form-data with the correct boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('winosa_token');
      localStorage.removeItem('winosa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;