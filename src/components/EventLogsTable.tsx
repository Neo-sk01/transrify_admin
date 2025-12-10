import React, { useState } from 'react';
import { DataTable, Column } from './DataTable';
import type { TransrifyEventLog } from '@/lib/types';

export interface EventLogsTableProps {
  logs: TransrifyEventLog[];
}

const PAYLOAD_TRUNCATE_LENGTH = 100;

function PayloadCell({ payload }: { payload: Record<string, unknown> }): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const payloadString = JSON.stringify(payload);
  const shouldTruncate = payloadString.length > PAYLOAD_TRUNCATE_LENGTH;

  if (!shouldTruncate) {
    return <span className="text-xs font-mono">{payloadString}</span>;
  }

  return (
    <div className="text-xs font-mono">
      {isExpanded ? (
        <div>
          <div className="whitespace-pre-wrap break-all">{payloadString}</div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 hover:text-blue-800 mt-1 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1 min-h-[44px] min-w-[44px] inline-flex items-center"
            aria-label="Collapse payload"
            aria-expanded="true"
          >
            Show less
          </button>
        </div>
      ) : (
        <div>
          <span className="break-all">
            {payloadString.slice(0, PAYLOAD_TRUNCATE_LENGTH)}...
          </span>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-800 ml-1 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1 min-h-[44px] min-w-[44px] inline-flex items-center"
            aria-label="Expand payload"
            aria-expanded="false"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

export function EventLogsTable({ logs }: EventLogsTableProps): JSX.Element {
  const columns: Column<TransrifyEventLog>[] = [
    {
      key: 'created_at',
      header: 'Time',
      width: '180px',
      render: (value: string) => {
        // Display in user's local timezone
        const date = new Date(value);
        return <span className="text-xs">{date.toLocaleString()}</span>;
      },
    },
    {
      key: 'event_type',
      header: 'Event Type',
      width: '150px',
      render: (value: string) => <span className="text-xs">{value}</span>,
    },
    {
      key: 'tenant_id',
      header: 'Tenant',
      width: '150px',
      render: (value: string) => (
        <span className="font-mono text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'payload',
      header: 'Payload',
      render: (value: Record<string, unknown>) => <PayloadCell payload={value} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      emptyMessage="No event logs found"
      maxHeight="600px"
    />
  );
}
