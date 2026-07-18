import api from './api';
import { unwrapApiResponse } from './apiHelpers';

const normalizeDonation = (donation) => donation && ({
  ...donation,
  id: String(donation.id || donation._id)
});

export const createDonation = async (payload) => {
  const response = await api.post('/donations', payload);
  return { donation: normalizeDonation(unwrapApiResponse(response)) };
};

export const getUserDonations = async (params = {}) => {
  const response = await api.get('/donations/user/history', { params: { limit: 100, ...params } });
  const data = unwrapApiResponse(response) || {};
  return {
    ...data,
    donations: (data.donations || []).map(normalizeDonation).filter(Boolean)
  };
};

export const getAllDonations = async (params = {}) => {
  const response = await api.get('/donations', { params: { limit: 100, ...params } });
  const data = unwrapApiResponse(response) || {};
  return { ...data, donations: (data.donations || []).map(normalizeDonation).filter(Boolean) };
};

export const updateDonationStatus = async (donationId, status) => {
  const response = await api.put(`/donations/${donationId}/status`, { status });
  return { donation: normalizeDonation(unwrapApiResponse(response)) };
};

export const getDonationStats = async () => {
  const response = await api.get('/donations/stats/overview');
  return { stats: unwrapApiResponse(response) || {} };
};

export const getDonationCategoryBreakdown = async () => {
  const response = await api.get('/donations/category/breakdown');
  return { categories: unwrapApiResponse(response) || [] };
};
