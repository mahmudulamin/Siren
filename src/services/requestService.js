import api from './api';
import { generateId } from '../utils/helpers';
import {
  buildOfflineRequest,
  cacheRequest,
  cacheServerRequests,
  getCachedRequestById,
  getCachedRequests,
  getPendingRequests,
  mergeRequests,
  normalizeRequest,
  removeCachedRequest
} from './offlineStore';
import { isBackendUnavailable, isNetworkError, unwrapApiResponse } from './apiHelpers';

const normalizeRequestResponse = (response) => {
  const apiData = unwrapApiResponse(response);

  if (!apiData) return apiData;
  if (apiData.request) {
    return { ...apiData, request: normalizeRequest(apiData.request) };
  }
  if (Array.isArray(apiData.requests)) {
    return {
      ...apiData,
      requests: apiData.requests.map(normalizeRequest).filter(Boolean)
    };
  }

  const request = normalizeRequest(apiData);
  return request ? { request } : apiData;
};

const applyFilters = (requests, filters = {}) => {
  return requests.filter((request) => {
    if (filters.status && request.status !== filters.status) return false;
    if (filters.severity && request.severity !== filters.severity) return false;
    if (filters.emergencyType && request.emergencyType !== filters.emergencyType) return false;

    if (filters.search) {
      const query = String(filters.search).toLowerCase();
      const text = [request.victimName, request.description, request.address]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!text.includes(query)) return false;
    }

    return true;
  });
};

const requireBackendUnavailable = (error) => {
  if (!isBackendUnavailable(error)) throw error;
};

const createPayload = (request) => ({
  victimName: request.victimName,
  phone: request.phone,
  email: request.email,
  address: request.address,
  coordinates: Number.isFinite(request.coordinates?.lat) &&
    Number.isFinite(request.coordinates?.lng)
    ? request.coordinates
    : null,
  emergencyType: request.emergencyType,
  description: request.description,
  severity: request.severity,
  photoUrl: request.photoUrl || null,
  clientRequestId: request.clientRequestId,
  locationSource: request.locationSource || 'address'
});

const updatePayload = (request) => {
  const payload = {};
  ['status', 'severity', 'assignedVolunteer'].forEach((field) => {
    if (request[field] !== undefined) payload[field] = request[field];
  });
  return payload;
};

export const getAllRequests = async (filters = {}) => {
  try {
    const response = await api.get('/requests', { params: filters });
    const apiData = normalizeRequestResponse(response) || {};
    const serverRequests = apiData.requests || [];
    cacheServerRequests(serverRequests);

    const pendingRequests = getPendingRequests();
    const combinedRequests = mergeRequests(pendingRequests, serverRequests, getCachedRequests());

    return {
      ...apiData,
      requests: applyFilters(combinedRequests, filters),
      offline: false
    };
  } catch (error) {
    requireBackendUnavailable(error);
    const requests = applyFilters(getCachedRequests(), filters);
    return { requests, total: requests.length, offline: true };
  }
};

export const getRequestById = async (id) => {
  if (String(id).startsWith('offline-')) {
    return { request: getCachedRequestById(id), offline: true };
  }

  try {
    const response = await api.get(`/requests/${id}`);
    const apiData = normalizeRequestResponse(response);
    if (apiData?.request) cacheRequest({ ...apiData.request, source: 'server', syncStatus: 'synced' });
    return apiData;
  } catch (error) {
    requireBackendUnavailable(error);
    return { request: getCachedRequestById(id), offline: true };
  }
};

export const createRequest = async (requestData) => {
  const clientRequestId = requestData.clientRequestId || `client-${generateId()}`;
  const requestWithClientId = { ...requestData, clientRequestId };

  if (navigator.onLine) {
    try {
      const response = await api.post('/requests', requestWithClientId);
      const apiData = normalizeRequestResponse(response);
      if (apiData?.request) {
        cacheRequest({ ...apiData.request, source: 'server', syncStatus: 'synced' });
      }
      return apiData;
    } catch (error) {
      requireBackendUnavailable(error);
    }
  }

  const newRequest = buildOfflineRequest({
    id: `offline-${clientRequestId}`,
    ...requestWithClientId
  });
  cacheRequest(newRequest);
  return {
    request: newRequest,
    message: 'Request saved offline and queued for synchronization',
    offline: true
  };
};

export const updateRequest = async (id, updates) => {
  const cachedRequest = getCachedRequestById(id);

  if (navigator.onLine && !String(id).startsWith('offline-')) {
    try {
      const response = await api.put(`/requests/${id}`, updates);
      const apiData = normalizeRequestResponse(response);
      if (apiData?.request) {
        cacheRequest({ ...apiData.request, source: 'server', syncStatus: 'synced' });
      }
      return apiData;
    } catch (error) {
      requireBackendUnavailable(error);
    }
  }

  if (!cachedRequest) throw new Error('Request is not available offline');

  const updatedRequest = {
    ...cachedRequest,
    ...updates,
    syncStatus: 'pending',
    syncOperation: cachedRequest.syncOperation === 'create' ? 'create' : 'update',
    syncError: null,
    updatedAt: new Date().toISOString()
  };
  cacheRequest(updatedRequest);

  return {
    request: updatedRequest,
    message: 'Update saved offline and queued for synchronization',
    offline: true
  };
};

export const deleteRequest = async (id) => {
  const cachedRequest = getCachedRequestById(id, { includeDeleted: true });

  if (navigator.onLine && !String(id).startsWith('offline-')) {
    try {
      const response = await api.delete(`/requests/${id}`);
      removeCachedRequest(id);
      return normalizeRequestResponse(response);
    } catch (error) {
      requireBackendUnavailable(error);
    }
  }

  if (!cachedRequest) throw new Error('Request is not available offline');

  if (cachedRequest.syncOperation === 'create') {
    removeCachedRequest(id);
  } else {
    cacheRequest({
      ...cachedRequest,
      deletedLocally: true,
      syncStatus: 'pending',
      syncOperation: 'delete',
      syncError: null,
      updatedAt: new Date().toISOString()
    });
  }

  return { message: 'Request deleted locally and queued for synchronization', offline: true };
};

export const getRequestsByVictim = async (victimId) => {
  try {
    const response = await api.get(`/requests/victim/${victimId}`);
    const apiData = normalizeRequestResponse(response) || {};
    cacheServerRequests(apiData.requests || []);
    return {
      ...apiData,
      requests: mergeRequests(getPendingRequests(), apiData.requests || [], getCachedRequests())
    };
  } catch (error) {
    requireBackendUnavailable(error);
    return { requests: getCachedRequests(), offline: true };
  }
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error || new Error('Could not read photo'));
  reader.readAsDataURL(file);
});

export const uploadRequestPhoto = async (file) => ({ url: await fileToDataUrl(file) });

let activeSync = null;

const runSync = async () => {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const pendingRequests = getPendingRequests();
  let synced = 0;
  let failed = 0;

  for (const pendingRequest of pendingRequests) {
    try {
      if (pendingRequest.syncOperation === 'delete') {
        await api.delete(`/requests/${pendingRequest.id}`);
        removeCachedRequest(pendingRequest.id);
      } else {
        const response = pendingRequest.syncOperation === 'update'
          ? await api.put(`/requests/${pendingRequest.id}`, updatePayload(pendingRequest))
          : await api.post('/requests', createPayload(pendingRequest));
        const apiData = normalizeRequestResponse(response);

        if (!apiData?.request) throw new Error('Server returned an invalid request response');

        cacheRequest({
          ...apiData.request,
          source: 'server',
          syncStatus: 'synced',
          syncOperation: null,
          syncError: null,
          deletedLocally: false
        });

        if (pendingRequest.id !== apiData.request.id) {
          removeCachedRequest(pendingRequest.id);
        }
      }
      synced += 1;
    } catch (error) {
      failed += 1;
      cacheRequest({
        ...pendingRequest,
        syncError: error.response?.data?.message || error.message || 'Synchronization failed'
      });

      if (isNetworkError(error)) break;
    }
  }

  return { synced, failed };
};

export const syncOfflineRequests = () => {
  if (activeSync) return activeSync;

  activeSync = runSync().finally(() => {
    activeSync = null;
  });
  return activeSync;
};
