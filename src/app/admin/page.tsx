'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { TabContainer, Tab } from '@/components/TabContainer';
import { OverviewDashboard } from '@/components/OverviewDashboard';
import { SessionsTable } from '@/components/SessionsTable';
import { IncidentsTable } from '@/components/IncidentsTable';
import { EventLogsTable } from '@/components/EventLogsTable';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';

const token = process.env.NEXT_PUBLIC_ADMIN_VIEW_TOKEN || 'dev_admin_token_123';

const fetcher = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json());

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Detect online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const { data, isLoading, error, mutate } = useSWR(
    '/api/admin/state', 
    fetcher, 
    { 
      refreshInterval: isOnline ? 2000 : 0, // Pause polling when offline
      onSuccess: () => setLastUpdated(new Date())
    }
  );

  // Handle error state
  if (error) {
    return (
      <main className="p-6">
        <ErrorState 
          message="Auth failed or API error." 
          onRetry={() => mutate()}
        />
      </main>
    );
  }

  // Handle loading state
  if (isLoading || !data) {
    return (
      <>
        <OfflineBanner />
        <main className="p-6">
          <LoadingState type="skeleton" message="Loading dashboard data..." />
        </main>
      </>
    );
  }

  // Handle API error response
  if (!data.ok) {
    return (
      <main className="p-6">
        <ErrorState 
          message={data.error || 'Unknown error'} 
          onRetry={() => mutate()}
        />
      </main>
    );
  }

  // Calculate badge counts
  const openIncidentsCount = data.incidents.filter((i) => i.status === 'OPEN').length;

  const tabs: Tab[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      badge: openIncidentsCount 
    },
    { 
      id: 'sessions', 
      label: 'Sessions', 
      badge: data.sessions.length 
    },
    { 
      id: 'incidents', 
      label: 'Incidents', 
      badge: data.incidents.length 
    },
    { 
      id: 'eventLogs', 
      label: 'Event Logs', 
      badge: data.eventLogs.length 
    },
  ];

  return (
    <>
      <OfflineBanner />
      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                TRANSRIFY • Admin
              </h1>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                Real‑time view of sessions, incidents, and append‑only ledger (via polling).
              </p>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm" aria-live="polite">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700 font-medium">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <TabContainer tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          <ErrorBoundary>
            {activeTab === 'overview' && <OverviewDashboard data={data} />}
          </ErrorBoundary>
          <ErrorBoundary>
            {activeTab === 'sessions' && <SessionsTable sessions={data.sessions} />}
          </ErrorBoundary>
          <ErrorBoundary>
            {activeTab === 'incidents' && <IncidentsTable incidents={data.incidents} />}
          </ErrorBoundary>
          <ErrorBoundary>
            {activeTab === 'eventLogs' && <EventLogsTable logs={data.eventLogs} />}
          </ErrorBoundary>
        </TabContainer>
      </main>
    </>
  );
}