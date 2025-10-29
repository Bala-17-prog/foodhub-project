import api from './axios';

// Create new diet plan
export const createDietPlan = async (dietData) => {
  const response = await api.post('/diet-plan', dietData);
  return response.data;
};

// Get all user's diet plans
export const getUserDietPlans = async () => {
  const response = await api.get('/diet-plan');
  return response.data;
};

// Get single diet plan by ID
export const getDietPlanById = async (id) => {
  const response = await api.get(`/diet-plan/${id}`);
  return response.data;
};

// Update diet plan status
export const updateDietPlan = async (id, data) => {
  const response = await api.put(`/diet-plan/${id}`, data);
  return response.data;
};

// Delete diet plan
export const deleteDietPlan = async (id) => {
  const response = await api.delete(`/diet-plan/${id}`);
  return response.data;
};
