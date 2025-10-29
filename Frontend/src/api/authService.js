import api from './axios';

// Register user or restaurant
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Create admin (admin only)
export const createAdmin = async (adminData) => {
  const response = await api.post('/auth/admin/create', adminData);
  return response.data;
};

export default {
  register,
  login,
  createAdmin,
};
