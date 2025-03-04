import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Authentication failed');
    }
    return Promise.reject(error);
  }
);

export default api;