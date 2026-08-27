import api from './axios';

export const getAllProducts = (page = 0, size = 10) =>
  api.get(`/api/products/page/${page}/${size}`);

export const searchProducts = (q) => api.get(`/api/products/search?q=${encodeURIComponent(q || '')}`);

export const getCurrentUser = () => api.get('/users/me');

export const getCustomerOrders = (customerId) =>
  api.get(`/api/orders/customer/${customerId}`);

export const getVendorOrders = (vendorId) =>
  api.get(`/api/orders/vendor/${vendorId}`);

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/api/orders/${orderId}/status?status=${encodeURIComponent(status)}`);

export const getAllOrders = () => api.get('/api/orders');

export const createOrder = (payload) => api.post('/api/orders', payload);

export const addOrderItem = (payload) => api.post('/api/order-items', payload);
export const placeOrder = (orderId) => api.post(`/api/orders/${orderId}/place`);

export const getAllUsers = () => api.get('/users');

export const addUser = (payload) => api.post('/users', payload);

export const getAllVendors = () => api.get('/api/vendors');

export const addVendor = (payload) => api.post('/api/vendors', payload);

export const getVendorProducts = (vendorId) =>
  api.get(`/api/products/vendor/${vendorId}`);

export const getCurrentVendor = () => api.get('/api/vendors/me');

export const createMyVendor = (payload) => api.post('/api/vendors/me', payload);

export const addProduct = (vendorId, payload) =>
  api.post(`/api/products/${vendorId}`, payload);
