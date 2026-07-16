import api from './api';
import { generateId } from '../utils/helpers';
import {
  buildOfflineRequest,
  cacheRequest,
  getCachedRequestById,
  getCachedRequests,
  mergeRequests,
  removeCachedRequest
} from './offlineStore';
import { unwrapApiResponse } from './apiHelpers';

/**
 * Request Service
 * Handles help request operations
 */

// Seed data for demo/offline mode
const seedRequests = [
  {
    id: '1',
    victimName: 'Karim Ahmed',
    phone: '01712345678',
    email: 'karim@example.com',
    address: 'Sylhet Sadar, Sylhet',
    coordinates: { lat: 24.8949, lng: 91.8687 },
    emergencyType: 'Flood',
    description: 'House flooded, need immediate rescue',
    severity: 'critical',
    status: 'pending',
    photoUrl: null,
    createdAt: '2022-07-18T11:00:00Z',
    updatedAt: '2022-07-18T11:00:00Z',
    assignedVolunteer: null
  },
  {
    id: '2',
    victimName: 'Fatima Begum',
    phone: '01823456789',
    email: 'fatima@example.com',
    address: 'Sunamganj Sadar, Sunamganj',
    coordinates: { lat: 25.0658, lng: 91.3950 },
    emergencyType: 'Medical Emergency',
    description: 'Elderly person needs medical attention',
    severity: 'high',
    status: 'assigned',
    photoUrl: null,
    createdAt: '2023-07-19T10:00:00Z',
    updatedAt: '2023-07-19T10:00:00Z',
    assignedVolunteer: {
      id: 'v1',
      name: 'Rahman Volunteer'
    }
  },
  {
    id: '3',
    victimName: 'Rahim Mia',
    phone: '01934567890',
    email: 'rahim@example.com',
    address: 'Parshuram, Feni',
    coordinates: { lat: 23.0065, lng: 91.4205 },
    emergencyType: 'Food/Water Shortage',
    description: 'Need food and clean water supplies',
    severity: 'medium',
    status: 'in_progress',
    photoUrl: null,
    createdAt: '2024-08-14T00:00:00Z',
    updatedAt: '2024-08-14T00:00:00Z',
    assignedVolunteer: {
      id: 'v2',
      name: 'Sakib Volunteer'
    }
  }
];

const readFallbackRequests = () => {
  const cachedRequests = getCachedRequests();
  return cachedRequests.length > 0 ? cachedRequests : seedRequests;
};

const normalizeRequestResponse = (response) => {
  const apiData = unwrapApiResponse(response);

  if (apiData?.request) {
    return apiData;
  }

  return apiData;
};

/**
 * Get all help requests
 */
export const getAllRequests = async (filters = {}) => {
  try {
    const response = await api.get('/requests', { params: filters });
    const apiData = normalizeRequestResponse(response);
    const serverRequests = apiData?.requests || [];
    const localRequests = getCachedRequests();
    const combinedRequests = mergeRequests(serverRequests, localRequests);

    return {
      ...apiData,
      requests: combinedRequests.length > 0 ? combinedRequests : readFallbackRequests()
    };
  } catch (error) {
    console.warn('API not available, using mock data');
    
    // Apply filters to cached or seed data
    let filtered = [...readFallbackRequests()];
    
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.severity) {
      filtered = filtered.filter(r => r.severity === filters.severity);
    }
    if (filters.emergencyType) {
      filtered = filtered.filter(r => r.emergencyType === filters.emergencyType);
    }
    
    return { requests: filtered, total: filtered.length };
  }
};

/**
 * Get request by ID
 */
export const getRequestById = async (id) => {
  try {
    const response = await api.get(`/requests/${id}`);
    return normalizeRequestResponse(response);
  } catch (error) {
    console.warn('API not available, using mock data');
    const request = getCachedRequestById(id) || readFallbackRequests().find(r => r.id === id);
    return { request };
  }
};

/**
 * Create new help request
 */
export const createRequest = async (requestData) => {
  try {
    const response = await api.post('/requests', requestData);
    const apiData = normalizeRequestResponse(response);

    if (apiData?.request) {
      cacheRequest(apiData.request);
    }

    return apiData;
  } catch (error) {
    console.warn('API not available, saving request locally');
    
    const newRequest = buildOfflineRequest({
      id: `offline-${generateId()}`,
      ...requestData
    });
    
    cacheRequest(newRequest);
    return { request: newRequest, message: 'Request created successfully' };
  }
};

/**
 * Update request
 */
export const updateRequest = async (id, updates) => {
  try {
    const response = await api.put(`/requests/${id}`, updates);
    const apiData = normalizeRequestResponse(response);

    if (apiData?.request) {
      cacheRequest(apiData.request);
    }

    return apiData;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const localRequests = getCachedRequests();
    const index = localRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      const updatedRequest = {
        ...localRequests[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      cacheRequest(updatedRequest);
      return { request: updatedRequest, message: 'Request updated successfully' };
    }
    throw new Error('Request not found');
  }
};

/**
 * Delete request
 */
export const deleteRequest = async (id) => {
  try {
    const response = await api.delete(`/requests/${id}`);
    removeCachedRequest(id);
    return normalizeRequestResponse(response);
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const index = getCachedRequests().findIndex(r => r.id === id);
    if (index !== -1) {
      removeCachedRequest(id);
      return { message: 'Request deleted successfully' };
    }
    throw new Error('Request not found');
  }
};

/**
 * Get requests by victim
 */
export const getRequestsByVictim = async (victimId) => {
  try {
    const response = await api.get(`/requests/victim/${victimId}`);
    const apiData = normalizeRequestResponse(response);
    const combinedRequests = mergeRequests(apiData?.requests || [], getCachedRequests());
    return {
      ...apiData,
      requests: combinedRequests.length > 0 ? combinedRequests : readFallbackRequests()
    };
  } catch (error) {
    console.warn('API not available, using mock data');
    // For offline/demo mode, return cached or seed requests
    return { requests: readFallbackRequests() };
  }
};

/**
 * Upload photo for request
 */
export const uploadRequestPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock URL');
    return { url: URL.createObjectURL(file) };
  }
};

export const syncOfflineRequests = async () => {
  if (!navigator.onLine) {
    return { synced: 0 };
  }

  const pendingRequests = getCachedRequests().filter((request) => request.syncStatus === 'pending');
  let synced = 0;

  for (const pendingRequest of pendingRequests) {
    const payload = {
      victimName: pendingRequest.victimName,
      phone: pendingRequest.phone,
      email: pendingRequest.email,
      address: pendingRequest.address,
      coordinates: pendingRequest.coordinates,
      emergencyType: pendingRequest.emergencyType,
      description: pendingRequest.description,
      severity: pendingRequest.severity,
      photoUrl: pendingRequest.photoUrl || null
    };

    try {
      const response = await api.post('/requests', payload);
      const apiData = normalizeRequestResponse(response);

      if (apiData?.request) {
        cacheRequest({
          ...apiData.request,
          source: 'server',
          syncStatus: 'synced'
        });
        removeCachedRequest(pendingRequest.id);
        synced += 1;
      }
    } catch {
      // Keep the request locally until the next online sync.
    }
  }

  return { synced };
};
