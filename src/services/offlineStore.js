const LOCAL_REQUESTS_KEY = 'siren_local_requests';

const safeParse = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readRequests = () => safeParse(localStorage.getItem(LOCAL_REQUESTS_KEY), []);

const writeRequests = (requests) => {
  localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(requests));
};

export const getCachedRequests = () => readRequests();

export const cacheRequest = (request) => {
  const requests = readRequests();
  const index = requests.findIndex((item) => item.id === request.id);

  if (index >= 0) {
    requests[index] = {
      ...requests[index],
      ...request
    };
  } else {
    requests.unshift(request);
  }

  writeRequests(requests);
  return request;
};

export const removeCachedRequest = (requestId) => {
  const requests = readRequests().filter((request) => request.id !== requestId);
  writeRequests(requests);
};

export const getCachedRequestById = (requestId) => {
  return readRequests().find((request) => request.id === requestId) || null;
};

export const buildOfflineRequest = (requestData) => {
  const timestamp = new Date().toISOString();

  return {
    id: `offline-${timestamp.replace(/[:.]/g, '-')}`,
    ...requestData,
    source: 'local',
    syncStatus: 'pending',
    status: requestData.status || 'pending',
    createdAt: requestData.createdAt || timestamp,
    updatedAt: timestamp,
    assignedVolunteer: requestData.assignedVolunteer || null
  };
};

export const mergeRequests = (...requestGroups) => {
  const seen = new Set();
  const merged = [];

  requestGroups.flat().forEach((request) => {
    if (!request?.id || seen.has(request.id)) {
      return;
    }

    seen.add(request.id);
    merged.push(request);
  });

  return merged;
};
