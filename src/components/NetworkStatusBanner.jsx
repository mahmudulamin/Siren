import React from 'react';
import { WifiOff, Wifi, Database } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkStatusBanner = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span>Online mode active. Backend and local network sync are available.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="font-medium">Offline mode active.</span>
        </div>
        <div className="flex items-center gap-2 text-amber-800">
          <Database className="h-4 w-4" />
          <span>Requests are stored locally and will sync automatically when the connection returns.</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusBanner;
