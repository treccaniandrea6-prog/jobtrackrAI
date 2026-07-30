import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string = error.config?.url || '';
    const isPublicRoute = PUBLIC_ROUTES.some(route => requestUrl.includes(route));

    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;