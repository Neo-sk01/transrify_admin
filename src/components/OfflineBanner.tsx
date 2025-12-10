'use client';

import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-yellow-900 px-4 py-3 shadow-xl border-b-2 border-yellow-600 animate-fadeIn"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
        <svg
          className="w-6 h-6 animate-pulse"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-bold text-sm">
          You are currently offline. Data updates are paused.
        </span>
      </div>
    </div>
  );
}
