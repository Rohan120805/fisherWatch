import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5000',
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