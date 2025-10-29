import api from './axios';

// Get all foods with filters
export const getFoods = async (params = {}) => {
  const response = await api.get('/foods', { params });
  return response.data;
};

// Get restaurant's own foods (for restaurant dashboard)
export const getRestaurantFoods = async () => {
  const response = await api.get('/foods/my-foods');
  return response.data;
};

// Create food item (restaurant/admin only)
export const createFood = async (foodData) => {
  const response = await api.post('/foods', foodData);
  return response.data;
};

// Update food item
export const updateFood = async (foodId, foodData) => {
  const response = await api.put(`/foods/${foodId}`, foodData);
  return response.data;
};

// Delete food item
export const deleteFood = async (foodId) => {
  const response = await api.delete(`/foods/${foodId}`);
  return response.data;
};

// Get food by ID
export const getFoodById = async (foodId) => {
  const response = await api.get(`/foods/${foodId}`);
  return response.data;
};

export default {
  getFoods,
  getRestaurantFoods,
  createFood,
  updateFood,
  deleteFood,
  getFoodById,
};
