import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { readAll } from '@/lib/ledger';


export async function GET(req: NextRequest) {
const token = req.headers.get('authorization')?.replace('Bearer ', '');
if (token !== process.env.ADMIN_ACCESS_TOKEN) {
return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
}
const ledger = readAll();
const last = ledger.slice(Math.max(0, ledger.length - 200));
return NextResponse.json({ ok: true, sessions: db.sessions, incidents: db.incidents, ledger: last });
}