import api from './axios';

// Place order (user only)
export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Get user's orders
export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

// Get orders for logged-in restaurant
export const getRestaurantOrders = async () => {
  const response = await api.get('/orders/restaurant-orders');
  return response.data;
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// Update order status (restaurant/admin only)
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export default {
  placeOrder,
  getMyOrders,
  getRestaurantOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};
