import React from 'react';
import { DataTable, Column } from './DataTable';
import StatusPill, { StatusPillProps } from './StatusPill';
import type { TransrifySession } from '@/lib/types';

export interface SessionsTableProps {
  sessions: TransrifySession[];
}

export function SessionsTable({ sessions }: SessionsTableProps): React.ReactElement {
  const columns: Column<TransrifySession>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '150px',
      render: (value: unknown) => (
        <span 
          className="font-mono text-xs" 
          title={String(value)}
          aria-label={`Session ID: ${String(value)}`}
        >
          {String(value).slice(0, 8)}...
        </span>
      ),
    },
    {
      key: 'customer_id',
      header: 'Customer',
      width: '150px',
      render: (value: unknown) => (
        <span className="text-xs">{String(value).slice(0, 8)}...</span>
      ),
    },
    {
      key: 'tenant_id',
      header: 'Tenant',
      width: '150px',
      render: (value: unknown) => (
        <span className="text-xs">{String(value).slice(0, 8)}...</span>
      ),
    },
    {
      key: 'result',
      header: 'Result',
      width: '120px',
      render: (value: unknown) => {
        const status = String(value).toUpperCase() as StatusPillProps['value'];
        return <StatusPill value={status} />;
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (value: unknown) => (
        <span className="text-xs">{new Date(String(value)).toLocaleString()}</span>
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
