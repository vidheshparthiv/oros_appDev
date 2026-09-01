import api from './axios';

export const register = (userData) => {
  return api.post('/auth/register', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'CUSTOMER',
  });
};

export const login = (credentials) => {
  return api.post('/auth/login', {
    username: credentials.username,
    password: credentials.password,
  });
};
