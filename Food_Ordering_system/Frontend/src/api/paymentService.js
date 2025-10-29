import api from './axios';

// Get Razorpay Key
export const getRazorpayKey = async () => {
  const response = await api.get('/payment/key');
  return response.data.key;
};

// Create Razorpay Order
export const createRazorpayOrder = async (amount, currency = 'INR') => {
  const response = await api.post('/payment/create-order', { amount, currency });
  return response.data.order;
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post('/payment/verify', paymentData);
  return response.data;
};
