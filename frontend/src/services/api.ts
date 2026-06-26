import axios from 'axios';
import useAuthStore from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Ajouter le token aux headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.setState({ token: null, isAuthenticated: false, user: null });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string, firstName: string, lastName: string) =>
    apiClient.post('/auth/register', { email, password, firstName, lastName }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  logout: () => apiClient.post('/auth/logout'),
};

export const mediaAPI = {
  upload: (formData: FormData) =>
    apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (limit = 50, offset = 0) =>
    apiClient.get('/media', { params: { limit, offset } }),
  getById: (id: string) => apiClient.get(`/media/${id}`),
  update: (id: string, title?: string, description?: string, tags?: string[], category?: string) =>
    apiClient.put(`/media/${id}`, { title, description, tags, category }),
  delete: (id: string) => apiClient.delete(`/media/${id}`),
  search: (query: string, category?: string, mimeType?: string, limit = 50, offset = 0) =>
    apiClient.get('/media/search', { params: { query, category, mimeType, limit, offset } }),
  download: (id: string) => apiClient.get(`/media/${id}/download`),
};

export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (firstName: string, lastName: string, profileImage?: File) => {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    return apiClient.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/user/change-password', { currentPassword, newPassword }),
  deleteAccount: (password: string) =>
    apiClient.delete('/user/account', { data: { password } }),
};

export default apiClient;