import React from 'react';
import { OverviewCard } from './OverviewCard';
import { SessionsTable } from './SessionsTable';
import { IncidentsTable } from './IncidentsTable';
import type { TransrifyAdminState, TransrifySession, TransrifyIncident } from '@/lib/types';

export interface OverviewDashboardProps {
  data: TransrifyAdminState | undefined;
}

export interface DashboardMetrics {
  totalSessions: number;
  normalSessions: number;
  duressSessions: number;
  failedSessions: number;
  openIncidents: number;
  closedIncidents: number;
  recentEvents: number;
}

export function calculateMetrics(data: TransrifyAdminState | undefined): DashboardMetrics {
  if (!data) {
    return {
      totalSessions: 0,
      normalSessions: 0,
      duressSessions: 0,
      failedSessions: 0,
      openIncidents: 0,
      closedIncidents: 0,
      recentEvents: 0,
    };
  }

  const normalSessions = data.sessions.filter(s => s.result === 'NORMAL').length;
  const duressSessions = data.sessions.filter(s => s.result === 'DURESS').length;
  const failedSessions = data.sessions.filter(s => s.result === 'FAIL').length;
  const openIncidents = data.incidents.filter(i => i.status === 'OPEN').length;
  const closedIncidents = data.incidents.filter(i => i.status === 'CLOSED').length;

  return {
    totalSessions: data.sessions.length,
    normalSessions,
    duressSessions,
    failedSessions,
    openIncidents,
    closedIncidents,
    recentEvents: data.eventLogs.length,
  };
}

export function getRecentSessions(sessions: TransrifySession[], limit: number = 5): TransrifySession[] {
  return [...sessions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export function getRecentIncidents(incidents: TransrifyIncident[], limit: number = 5): TransrifyIncident[] {
  return [...incidents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export function OverviewDashboard({ data }: OverviewDashboardProps): React.ReactElement {
  const metrics = calculateMetrics(data);
  const recentSessions = data ? getRecentSessions(data.sessions, 5) : [];
  const recentIncidents = data ? getRecentIncidents(data.incidents, 5) : [];

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 responsive-grid">
        <OverviewCard
          title="Total Sessions"
          value={metrics.totalSessions}
          variant="default"
        />
        <OverviewCard
          title="Duress Sessions"
          value={metrics.duressSessions}
          variant={metrics.duressSessions > 0 ? 'danger' : 'default'}
        />
        <OverviewCard
          title="Open Incidents"
          value={metrics.openIncidents}
          variant={metrics.openIncidents > 0 ? 'warning' : 'default'}
        />
        <OverviewCard
          title="Recent Events"
          value={metrics.recentEvents}
          variant="default"
        />
      </div>

      {/* Recent Sessions */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Recent Sessions</h3>
          <span className="text-sm text-gray-500 font-medium">Last 5</span>
        </div>
        <SessionsTable sessions={recentSessions} />
      </div>

      {/* Recent Incidents */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Recent Incidents</h3>
          <span className="text-sm text-gray-500 font-medium">Last 5</span>
        </div>
        <IncidentsTable incidents={recentIncidents} />
      </div>
    </div>
  );
}
