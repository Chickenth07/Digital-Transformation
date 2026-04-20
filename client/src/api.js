import axios from 'axios';

// In production (Vercel), VITE_API_URL is set to the Render backend URL.
// In development, fallback to '/api' which Vite proxies to localhost:3001.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach admin token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
