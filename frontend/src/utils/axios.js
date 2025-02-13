import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5000/auth',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export default api;