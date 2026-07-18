import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as authLogout } from '../services/authService';

/**
 * Auth Context for managing authentication state
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(localStorage.getItem('token') ? currentUser : null);
    setLoading(false);
  }, []);
  
  const login = (userData) => {
    setUser(userData);
  };
  
  const logout = () => {
    authLogout();
    setUser(null);
  };
  
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const isAuthenticated = Boolean(user && localStorage.getItem('token'));
  
  const hasRole = (role) => {
    return user?.role === role;
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
