'use client';
import { useState } from 'react';


export default function DemoPage() {
const [nationalId, setNationalId] = useState('8001015009087');
const [pin, setPin] = useState('1234');
const [sessionId, setSessionId] = useState('');
const [out, setOut] = useState<any>(null);


async function login() {
const res = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nationalId, pin }) });
const j = await res.json();
setOut(j);
if (j.sessionId) setSessionId(j.sessionId);
}


async function verify() {
if (!sessionId) return;
const res = await fetch(`/api/verify?sessionId=${sessionId}`);
const j = await res.json();
setOut(j);
}


return (
<main className="p-6 space-y-4 max-w-xl">
<h1 className="text-2xl font-bold">Demo Login</h1>
<div className="space-y-2">
<label className="block text-sm">National ID</label>
<input className="border rounded p-2 w-full" value={nationalId} onChange={e=>setNationalId(e.target.value)} />
<label className="block text-sm">PIN</label>
<input className="border rounded p-2 w-full" value={pin} onChange={e=>setPin(e.target.value)} />
</div>
<div className="flex gap-2">
<button onClick={login} className="px-3 py-2 rounded bg-black text-white">Login</button>
<button onClick={verify} className="px-3 py-2 rounded border">Verify</button>
</div>
<pre className="bg-gray-50 border rounded p-3 overflow-auto text-xs">{JSON.stringify(out, null, 2)}</pre>
<p className="text-xs text-gray-500">Use PIN <strong>1234</strong> for normal. Use <strong>9876</strong> for duress.</p>
<p className="text-xs text-gray-500">Then open <code>/admin</code> to see sessions, incidents, and the ledger update.</p>
</main>
);
}