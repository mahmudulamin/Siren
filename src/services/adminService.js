import api from './api';
import { isBackendUnavailable, unwrapApiResponse } from './apiHelpers';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return { stats: unwrapApiResponse(response) };
};

export const getAnalytics = async (period = '7d') => {
  const response = await api.get('/admin/analytics', { params: { period } });
  return { analytics: unwrapApiResponse(response) };
};

export const getZonePredictions = async () => {
  try {
    const response = await api.get('/admin/zones');
    return { zones: unwrapApiResponse(response) || [] };
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error;
    return { zones: [], offline: true };
  }
};
