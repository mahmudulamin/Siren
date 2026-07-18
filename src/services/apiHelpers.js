/**
 * Normalizes API responses returned by the backend and mock fallbacks.
 * Backend responses are wrapped as { success, message, data }.
 */
export const unwrapApiResponse = (response) => {
  const payload = response?.data ?? response;

  if (
    payload &&
    typeof payload === 'object' &&
    Object.prototype.hasOwnProperty.call(payload, 'data') &&
    (Object.prototype.hasOwnProperty.call(payload, 'success') ||
      Object.prototype.hasOwnProperty.call(payload, 'message'))
  ) {
    return payload.data;
  }

  return payload;
};

export const getApiErrorMessage = (error, fallbackMessage = 'Request failed') => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

export const isNetworkError = (error) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
  return !error?.response;
};
