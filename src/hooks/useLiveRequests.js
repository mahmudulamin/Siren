import { useCallback, useEffect, useState } from 'react';
import { getAllRequests } from '../services/requestService';

const LIVE_REFRESH_INTERVAL = 15000;

/**
 * Keeps emergency requests current across polling, reconnects, tab focus and
 * localStorage changes made by another SIREN tab.
 */
export const useLiveRequests = ({ interval = LIVE_REFRESH_INTERVAL, enabled = true } = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const response = await getAllRequests({ limit: 100 });
      setRequests(response.requests || []);
      setOffline(Boolean(response.offline));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading live emergency requests:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    refresh();

    const timer = window.setInterval(refresh, interval);
    const handleStorage = (event) => {
      if (!event.key || event.key === 'siren_local_requests') refresh();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('online', refresh);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('online', refresh);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled, interval, refresh]);

  return { requests, loading, offline, lastUpdated, refresh };
};
