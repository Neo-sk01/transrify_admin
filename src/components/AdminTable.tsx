import StatusPill from './StatusPill';
import type { Session, Incident, LedgerEntry } from '@/lib/types';


type Props = { sessions: Session[]; incidents: Incident[]; ledger: LedgerEntry[] };


export default function AdminTable({ sessions, incidents, ledger }: Props) {
return (
<div className="grid md:grid-cols-2 gap-6">
<div className="p-4 border rounded-2xl shadow-sm">
<h2 className="font-semibold mb-2">Sessions</h2>
<div className="overflow-auto max-h-96">
<table className="w-full text-sm">
<thead><tr><th className="text-left">ID</th><th>User</th><th>Status</th><th>Since</th></tr></thead>
<tbody>
{sessions.map((s) => (
<tr key={s.id} className="border-t">
<td className="py-1">{s.id}</td>
<td>{s.userId}</td>
<td><StatusPill value={s.status} /></td>
<td>{new Date(s.createdAt).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>


<div className="p-4 border rounded-2xl shadow-sm">
<h2 className="font-semibold mb-2">Incidents</h2>
<div className="overflow-auto max-h-96">
<table className="w-full text-sm">
<thead><tr><th>Time</th><th>Kind</th><th>Session</th><th>User</th><th>Note</th></tr></thead>
<tbody>
{incidents.map((i) => (
<tr key={i.id} className="border-t">
<td className="py-1">{new Date(i.createdAt).toLocaleString()}</td>
<td>{i.kind}</td>
<td>{i.sessionId}</td>
<td>{i.userId}</td>
<td>{i.note || '-'}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>


<div className="md:col-span-2 p-4 border rounded-2xl shadow-sm">
<h2 className="font-semibold mb-2">Tamper‑proof Log (latest 200)</h2>
<div className="overflow-auto max-h-96">
<table className="w-full text-xs">
<thead><tr><th>ts</th><th>type</th><th>session</th><th>user</th><th>hash</th><th>prev</th></tr></thead>
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
</div>
);
}