'use client';
import useSWR from 'swr';
import AdminTable from '@/components/AdminTable';


const token = process.env.NEXT_PUBLIC_ADMIN_VIEW_TOKEN || 'dev_admin_token_123';


const fetcher = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json());


export default function AdminPage() {
const { data, isLoading, error } = useSWR('/api/admin/state', fetcher, { refreshInterval: 2000 });
if (error) return <div className="p-6">Auth failed or API error.</div>;
if (isLoading || !data) return <div className="p-6">Loading…</div>;
if (!data.ok) return <div className="p-6">{data.error || 'Unknown error'}</div>;
return (
<main className="p-6 space-y-4">
<h1 className="text-2xl font-bold">TRANSRIFY • Admin</h1>
<p className="text-sm text-gray-500">Real‑time view of sessions, incidents, and append‑only ledger (via polling).</p>
<AdminTable 
  sessions={data.sessions} 
  incidents={data.incidents} 
  eventLogs={data.eventLogs}
  ledger={data.ledger} 
/>
</main>
);
}