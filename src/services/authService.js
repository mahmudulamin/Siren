import api from './api';
import { unwrapApiResponse } from './apiHelpers';
import { clearSyncedRequestCache } from './offlineStore';

/**
 * Authentication Service
 * Handles login, register, and auth state management
 */

/**
 * Login user
 */
export const login = async (email, password, role) => {
  const response = await api.post('/auth/login', { email, password, role });
  const apiData = unwrapApiResponse(response);

  // Store token and user data
  if (apiData?.token) {
    clearSyncedRequestCache();
    localStorage.setItem('token', apiData.token);
    localStorage.setItem('user', JSON.stringify(apiData.user));
  }

  return apiData;
};

/**
 * Register new user
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  const apiData = unwrapApiResponse(response);

  // Store token and user data
  if (apiData?.token) {
    clearSyncedRequestCache();
    localStorage.setItem('token', apiData.token);
    localStorage.setItem('user', JSON.stringify(apiData.user));
  }

  return apiData;
};

/**
 * Logout user
 */
export const logout = () => {
  clearSyncedRequestCache();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const updateProfile = async (updates) => {
  const response = await api.put('/auth/me', updates);
  const user = unwrapApiResponse(response);
  localStorage.setItem('user', JSON.stringify(user));
  return { user };
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/password', { currentPassword, newPassword });
  return response.data;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  if (!localStorage.getItem('token')) return null;
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get auth token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};
