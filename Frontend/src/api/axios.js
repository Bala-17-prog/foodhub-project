import axios from 'axios';

// Allow runtime override via window.__API_URL__ (useful for changing backend URL without rebuilding)
// Priority: window.__API_URL__ -> Vite build-time VITE_API_URL -> default production backend
const API_URL = (typeof window !== 'undefined' && window.__API_URL__) || import.meta.env.VITE_API_URL || 'https://foodhub-backend-fghd.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Temporarily disabled auto-logout to debug payment issues
    // Only logout on 401 for auth endpoints, not payment errors
    // if (error.response?.status === 401) {
    //   const url = error.config?.url || '';
    //   // Don't auto-logout for payment endpoints - let them handle errors
    //   if (!url.includes('/payment/')) {
    //     // Token expired or invalid
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     window.location.href = '/login';
    //   }
    // }
    return Promise.reject(error);
  }
);

export default api;
