import api from './api';
import { generateId } from '../utils/helpers';

/**
 * Request Service
 * Handles help request operations
 */

// Mock data for development
let mockRequests = [
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

/**
 * Get all help requests
 */
export const getAllRequests = async (filters = {}) => {
  try {
    const response = await api.get('/requests', { params: filters });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    // Apply filters to mock data
    let filtered = [...mockRequests];
    
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
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    const request = mockRequests.find(r => r.id === id);
    return { request };
  }
};

/**
 * Create new help request
 */
export const createRequest = async (requestData) => {
  try {
    const response = await api.post('/requests', requestData);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const newRequest = {
      id: generateId(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedVolunteer: null
    };
    
    mockRequests.push(newRequest);
    return { request: newRequest, message: 'Request created successfully' };
  }
};

/**
 * Update request
 */
export const updateRequest = async (id, updates) => {
  try {
    const response = await api.put(`/requests/${id}`, updates);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const index = mockRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequests[index] = {
        ...mockRequests[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return { request: mockRequests[index], message: 'Request updated successfully' };
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
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const index = mockRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequests.splice(index, 1);
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
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // For mock, return all requests
    return { requests: mockRequests };
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
