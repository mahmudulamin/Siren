import { useEffect } from 'react';
import { syncOfflineRequests } from '../services/requestService';

export const useOfflineSync = () => {
  useEffect(() => {
    const syncNow = () => {
      if (navigator.onLine) {
        syncOfflineRequests().catch(() => {
          // Intentionally silent: syncing should not block the UI.
        });
      }
    };

    syncNow();
    window.addEventListener('online', syncNow);
    const retryTimer = window.setInterval(syncNow, 30000);

    return () => {
      window.removeEventListener('online', syncNow);
      window.clearInterval(retryTimer);
    };
  }, []);
};
