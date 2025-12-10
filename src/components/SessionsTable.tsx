import React from 'react';
import { DataTable, Column } from './DataTable';
import StatusPill from './StatusPill';
import type { TransrifySession } from '@/lib/types';

export interface SessionsTableProps {
  sessions: TransrifySession[];
}

export function SessionsTable({ sessions }: SessionsTableProps): JSX.Element {
  const columns: Column<TransrifySession>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '150px',
      render: (value: string) => (
        <span 
          className="font-mono text-xs" 
          title={value}
          aria-label={`Session ID: ${value}`}
        >
          {value.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: 'customer_id',
      header: 'Customer',
      width: '150px',
      render: (value: string) => (
        <span className="text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'tenant_id',
      header: 'Tenant',
      width: '150px',
      render: (value: string) => (
        <span className="text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'result',
      header: 'Result',
      width: '120px',
      render: (value: string) => <StatusPill value={value} />,
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (value: string) => (
        <span className="text-xs">{new Date(value).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sessions}
      emptyMessage="No sessions found"
      maxHeight="600px"
    />
  );
}
