import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track active toast to avoid duplicates
let wakeUpToastId = null;

// Request interceptor to add token and handle slow server wake-up
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set up a timeout to show wake-up message after 5 seconds
    config.wakeUpTimer = setTimeout(() => {
      if (!wakeUpToastId) {
        wakeUpToastId = toast.info(
          '⏳ Server is waking up from sleep... This may take up to 50 seconds on first request.',
          {
            autoClose: false, // Keep it open until request completes
            closeButton: true,
          }
        );
      }
    }, 5000);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and clear wake-up timer
api.interceptors.response.use(
  (response) => {
    // Clear the wake-up timer and dismiss toast if shown
    if (response.config.wakeUpTimer) {
      clearTimeout(response.config.wakeUpTimer);
    }
    if (wakeUpToastId) {
      toast.dismiss(wakeUpToastId);
      wakeUpToastId = null;
    }
    return response;
  },
  async (error) => {
    // Clear the wake-up timer and dismiss toast if shown
    if (error.config?.wakeUpTimer) {
      clearTimeout(error.config.wakeUpTimer);
    }
    if (wakeUpToastId) {
      toast.dismiss(wakeUpToastId);
      wakeUpToastId = null;
    }

    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        localStorage.setItem('accessToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const { data } = await api.post('/users/register', userData);
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post('/users/login', credentials);
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/users/current-user');
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.patch('/users/profile', profileData);
    return data;
  },

  changePassword: async (passwordData) => {
    const { data } = await api.post('/users/change-password', passwordData);
    return data;
  },
};

// Admin Services
export const adminService = {
  getAllUsers: async (params = {}) => {
    const { data } = await api.get('/users/admin/users', { params });
    return data;
  },

  activateUser: async (userId) => {
    const { data } = await api.patch(`/users/admin/users/${userId}/activate`);
    return data;
  },

  deactivateUser: async (userId) => {
    const { data } = await api.patch(`/users/admin/users/${userId}/deactivate`);
    return data;
  },
};

export default api;
