import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    config.url?.includes(endpoint),
  );

  if (isPublicEndpoint) {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } catch (e) {
        // ignore
      }
        // Do not auto-redirect on 401/403; let the UI decide how to handle auth errors.
        // Mark the error so callers can detect auth failures.
        try {
          error.isAuthError = true;
        } catch (e) {
          // ignore
        }
    }
    return Promise.reject(error);
  },
);

export default api;
