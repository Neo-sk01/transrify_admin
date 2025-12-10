'use client';

import React, { useState } from 'react';
import StatusPill from './StatusPill';
import type { TransrifyIncident } from '@/lib/types';
import { EvidenceModal } from './EvidenceModal';

export interface IncidentsTableProps {
  incidents: TransrifyIncident[];
}

export function IncidentsTable({ incidents }: IncidentsTableProps): React.ReactElement {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  // Sort incidents by creation timestamp descending (newest first)
  const sortedIncidents = [...incidents].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sortedIncidents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No incidents found
      </div>
    );
  }

  return (
    <div className="overflow-auto" style={{ maxHeight: '600px' }}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '180px' }}>
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>
              Session
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedIncidents.map((incident, index) => {
            const isOpen = incident.status === 'OPEN';
            const lat = parseFloat(incident.lat).toFixed(4);
            const lng = parseFloat(incident.lng).toFixed(4);
            
            return (
              <tr
                key={index}
                className={isOpen ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                data-status={incident.status}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="text-xs">{new Date(incident.created_at).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <StatusPill value={incident.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <a 
                    href={`#session-${incident.session_id}`} 
                    className="font-mono text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1 min-h-[44px] min-w-[44px] inline-flex items-center"
                    aria-label={`View session ${incident.session_id}`}
                  >
                    {incident.session_id.slice(0, 8)}...
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="text-xs">{incident.customer_id.slice(0, 8)}...</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="text-xs">{lat}, {lng}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                    aria-label={`View evidence for incident ${incident.id}`}
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Evidence
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedIncidentId && (
        <EvidenceModal
          incidentId={selectedIncidentId}
          isOpen={!!selectedIncidentId}
          onClose={() => setSelectedIncidentId(null)}
        />
      )}
    </div>
  );
}
