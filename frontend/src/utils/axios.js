import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL+'/auth',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export default api;