import StatusPill from './StatusPill';
import type { 
  LedgerEntry, 
  TransrifySession, 
  TransrifyIncident, 
  TransrifyEventLog 
} from '@/lib/types';

type Props = { 
  sessions: TransrifySession[]; 
  incidents: TransrifyIncident[]; 
  eventLogs?: TransrifyEventLog[];
  ledger?: LedgerEntry[] 
};


export default function AdminTable({ sessions, incidents, eventLogs, ledger }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Sessions Table */}
      <div className="p-4 border rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-2">Sessions</h2>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th>Customer</th>
                <th>Tenant</th>
                <th>Result</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-1 font-mono text-xs">{s.id.slice(0, 8)}...</td>
                  <td>{s.customer_id.slice(0, 8)}...</td>
                  <td>{s.tenant_id.slice(0, 8)}...</td>
                  <td><StatusPill value={s.result.toLowerCase() as 'normal' | 'fail' | 'duress'} /></td>
                  <td>{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="p-4 border rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-2">Incidents</h2>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Time</th>
                <th>Status</th>
                <th>Session</th>
                <th>Customer</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="py-1">{new Date(i.created_at).toLocaleString()}</td>
                  <td><StatusPill value={i.status.toLowerCase() as 'open' | 'closed'} /></td>
                  <td className="font-mono text-xs">{i.session_id.slice(0, 8)}...</td>
                  <td>{i.customer_id.slice(0, 8)}...</td>
                  <td className="text-xs">{parseFloat(i.lat).toFixed(4)}, {parseFloat(i.lng).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Logs Table */}
      {eventLogs && eventLogs.length > 0 && (
        <div className="md:col-span-2 p-4 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Event Logs</h2>
          <div className="overflow-auto max-h-96">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left">Time</th>
                  <th>Event Type</th>
                  <th>Tenant</th>
                  <th>Payload</th>
                </tr>
              </thead>
              <tbody>
                {eventLogs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="py-1">{new Date(log.created_at).toLocaleTimeString()}</td>
                    <td>{log.event_type}</td>
                    <td className="font-mono">{log.tenant_id.slice(0, 8)}...</td>
                    <td className="max-w-[300px] truncate" title={JSON.stringify(log.payload)}>
                      {JSON.stringify(log.payload)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legacy Ledger (if available) */}
      {ledger && ledger.length > 0 && (
        <div className="md:col-span-2 p-4 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Legacy Tamper‑proof Log (latest 200)</h2>
          <div className="overflow-auto max-h-96">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th>ts</th>
                  <th>type</th>
                  <th>session</th>
                  <th>user</th>
                  <th>hash</th>
                  <th>prev</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="py-1">{new Date(l.ts).toLocaleTimeString()}</td>
                    <td>{l.type}</td>
                    <td>{l.sessionId || '-'}</td>
                    <td>{l.userId || '-'}</td>
                    <td className="font-mono truncate max-w-[260px]" title={l.hash}>{l.hash}</td>
                    <td className="font-mono truncate max-w-[260px]" title={l.prevHash}>{l.prevHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}