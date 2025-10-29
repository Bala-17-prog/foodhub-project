import api from './axios';

// Get all restaurants (approved & active)
export const getAllRestaurants = async () => {
  const response = await api.get('/restaurants/');
  return response.data;
};

// Get my restaurant (for logged-in restaurant owner)
export const getMyRestaurant = async () => {
  const response = await api.get('/restaurants/my-restaurant');
  return response.data;
};

// Create restaurant (restaurant owner only)
export const createRestaurant = async (restaurantData) => {
  const response = await api.post('/restaurants', restaurantData);
  console.log(response.data);
  return response.data;
};

// Update restaurant
export const updateRestaurant = async (restaurantId, restaurantData) => {
  const response = await api.put(`/restaurants/${restaurantId}`, restaurantData);
  return response.data;
};

// Approve restaurant (admin only)
export const approveRestaurant = async (restaurantId) => {
  const response = await api.put(`/restaurants/${restaurantId}/approve`);
  return response.data;
};

// Reject restaurant (admin only)
export const rejectRestaurant = async (restaurantId) => {
  const response = await api.put(`/restaurants/${restaurantId}/reject`);
  return response.data;
};

// Get restaurant by ID
export const getRestaurantById = async (restaurantId) => {
  const response = await api.get(`/restaurants/${restaurantId}`);
  return response.data;
};

export default {
  getAllRestaurants,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
  approveRestaurant,
  rejectRestaurant,
  getRestaurantById,
};
