import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const token  = JSON.parse(userData);
      if (token?.user?.token) {
        config.headers.Authorization = `Bearer ${token?.user?.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 