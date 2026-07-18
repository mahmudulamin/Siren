import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, Database } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import {
  getPendingRequestCount,
  OFFLINE_QUEUE_CHANGED_EVENT
} from '../services/offlineStore';

const NetworkStatusBanner = () => {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(getPendingRequestCount);

  useEffect(() => {
    const updatePendingCount = () => setPendingCount(getPendingRequestCount());
    window.addEventListener(OFFLINE_QUEUE_CHANGED_EVENT, updatePendingCount);
    window.addEventListener('storage', updatePendingCount);

    return () => {
      window.removeEventListener(OFFLINE_QUEUE_CHANGED_EVENT, updatePendingCount);
      window.removeEventListener('storage', updatePendingCount);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span>
            {pendingCount > 0
              ? `Internet এসেছে—সংরক্ষিত ${pendingCount}টি রিপোর্ট SIREN-এ পাঠানো হচ্ছে…`
              : 'Internet চালু আছে—সব সংরক্ষিত রিপোর্ট sync হয়েছে।'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="font-medium">Internet নেই—অফলাইন mode চালু আছে।</span>
        </div>
        <div className="flex items-center gap-2 text-amber-800">
          <Database className="h-4 w-4" />
          <span>
            রিপোর্ট এই device-এ নিরাপদে থাকবে এবং internet ফিরলে নিজে থেকে পাঠানো হবে।
            {pendingCount > 0 && ` অপেক্ষায় আছে: ${pendingCount}টি রিপোর্ট।`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusBanner;
