import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ryhnnas.web.id/sipdana/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sipdana-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
