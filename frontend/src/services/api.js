import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const updatePassword = (data) => api.put('/auth/password', data);
export const getUsers = (params) => api.get('/users', { params });
export const createUser = (data) => api.post('/users', data);
export const getUserById = (id) => api.get(`/users/${id}`);
export const getDashboardStats = () => api.get('/users/dashboard');
export const getStores = (params) => api.get('/stores', { params });
export const createStore = (data) => api.post('/stores', data);
export const getOwnerDashboard = () => api.get('/stores/owner/dashboard');
export const submitRating = (data) => api.post('/ratings', data);
