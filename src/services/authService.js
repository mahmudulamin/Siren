import api from './api';
import { isBackendUnavailable, unwrapApiResponse } from './apiHelpers';

/**
 * Authentication Service
 * Handles login, register, and auth state management
 */

/**
 * Login user
 */
export const login = async (email, password, role) => {
  try {
    const response = await api.post('/auth/login', { email, password, role });
    const apiData = unwrapApiResponse(response);
    
    // Store token and user data
    if (apiData?.token) {
      localStorage.setItem('token', apiData.token);
      localStorage.setItem('user', JSON.stringify(apiData.user));
    }
    
    return apiData;
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error;
    // Mock response for development
    console.warn('API not available, using mock data');
    const mockUser = {
      id: '1',
      email,
      role,
      name: email.split('@')[0],
      phone: '01712345678'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return { user: mockUser, token: mockToken };
  }
};

/**
 * Register new user
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const apiData = unwrapApiResponse(response);
    
    // Store token and user data
    if (apiData?.token) {
      localStorage.setItem('token', apiData.token);
      localStorage.setItem('user', JSON.stringify(apiData.user));
    }
    
    return apiData;
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error;
    // Mock response for development
    console.warn('API not available, using mock data');
    const mockUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return { user: mockUser, token: mockToken };
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
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
