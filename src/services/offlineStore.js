const LOCAL_REQUESTS_KEY = 'siren_local_requests';
export const OFFLINE_QUEUE_CHANGED_EVENT = 'siren:offline-queue-changed';

const safeParse = (value, fallback) => {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const normalizeRequest = (request) => {
  if (!request || typeof request !== 'object') return null;

  const id = request.id || request._id;
  if (!id) return null;

  return {
    ...request,
    id: String(id)
  };
};

const readRequests = () => {
  if (typeof localStorage === 'undefined') return [];

  return safeParse(localStorage.getItem(LOCAL_REQUESTS_KEY), [])
    .map(normalizeRequest)
    .filter(Boolean);
};

const notifyQueueChanged = (requests) => {
  if (typeof window === 'undefined') return;

  const pendingCount = requests.filter((request) => request.syncStatus === 'pending').length;
  window.dispatchEvent(
    new CustomEvent(OFFLINE_QUEUE_CHANGED_EVENT, { detail: { pendingCount } })
  );
};

const writeRequests = (requests) => {
  let storedRequests = requests;

  try {
    localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(storedRequests));
  } catch (error) {
    // Preserve the life-saving text/location report if browser storage cannot
    // fit one or more encoded photos.
    storedRequests = requests.map((request) => (
      typeof request.photoUrl === 'string' && request.photoUrl.startsWith('data:')
        ? { ...request, photoUrl: null, photoOmittedOffline: true }
        : request
    ));

    try {
      localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(storedRequests));
    } catch {
      throw new Error('Device storage is full. Free some browser storage and try again.', {
        cause: error
      });
    }
  }

  notifyQueueChanged(storedRequests);
};

export const getCachedRequests = ({ includeDeleted = false } = {}) => {
  const requests = readRequests();
  return includeDeleted ? requests : requests.filter((request) => !request.deletedLocally);
};

export const getPendingRequests = () => {
  return getCachedRequests({ includeDeleted: true }).filter(
    (request) => request.syncStatus === 'pending'
  );
};

export const getPendingRequestCount = () => getPendingRequests().length;

export const clearSyncedRequestCache = () => {
  const pendingRequests = readRequests().filter((request) => request.syncStatus === 'pending');
  writeRequests(pendingRequests);
};

export const cacheRequest = (request) => {
  const normalizedRequest = normalizeRequest(request);
  if (!normalizedRequest) return null;

  const requests = readRequests();
  const index = requests.findIndex((item) => item.id === normalizedRequest.id);

  if (index >= 0) {
    requests[index] = { ...requests[index], ...normalizedRequest };
  } else {
    requests.unshift(normalizedRequest);
  }

  writeRequests(requests);
  return normalizedRequest;
};

export const cacheServerRequests = (serverRequests = []) => {
  const requests = readRequests();

  serverRequests.map(normalizeRequest).filter(Boolean).forEach((serverRequest) => {
    const index = requests.findIndex((item) => item.id === serverRequest.id);
    const syncedRequest = {
      ...serverRequest,
      source: 'server',
      syncStatus: 'synced',
      syncOperation: null,
      syncError: null,
      deletedLocally: false
    };

    if (index < 0) {
      requests.push(syncedRequest);
    } else if (requests[index].syncStatus !== 'pending') {
      requests[index] = syncedRequest;
    }
  });

  writeRequests(requests);
  return getCachedRequests();
};

export const removeCachedRequest = (requestId) => {
  const id = String(requestId);
  const requests = readRequests().filter((request) => request.id !== id);
  writeRequests(requests);
};

export const getCachedRequestById = (requestId, { includeDeleted = false } = {}) => {
  const id = String(requestId);
  const request = readRequests().find((item) => item.id === id) || null;
  return request && (includeDeleted || !request.deletedLocally) ? request : null;
};

export const buildOfflineRequest = (requestData) => {
  const timestamp = new Date().toISOString();

  return normalizeRequest({
    ...requestData,
    source: 'local',
    syncStatus: 'pending',
    syncOperation: 'create',
    syncError: null,
    status: requestData.status || 'pending',
    createdAt: requestData.createdAt || timestamp,
    updatedAt: timestamp,
    assignedVolunteer: requestData.assignedVolunteer || null
  });
};

export const mergeRequests = (...requestGroups) => {
  const seen = new Set();
  const merged = [];

  requestGroups.flat().forEach((request) => {
    const normalizedRequest = normalizeRequest(request);
    if (!normalizedRequest || normalizedRequest.deletedLocally || seen.has(normalizedRequest.id)) {
      return;
    }

    seen.add(normalizedRequest.id);
    merged.push(normalizedRequest);
  });

  return merged;
};
