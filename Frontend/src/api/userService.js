import api from './axios';

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get logged-in user profile
export const getMyProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Update user profile
export const updateProfile = async (userData) => {
  const response = await api.put('/users/update', userData);
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export default {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateProfile,
  deleteUser,
};
