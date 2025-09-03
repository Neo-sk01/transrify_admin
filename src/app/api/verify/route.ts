import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/store';
import { append } from '@/lib/ledger';


const Q = z.object({ sessionId: z.string() });


export async function GET(req: NextRequest) {
const { searchParams } = new URL(req.url);
const { sessionId } = Q.parse({ sessionId: searchParams.get('sessionId') });
const s = db.sessions.find(x => x.id === sessionId);
if (!s) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
append('VERIFY', { sessionId: s.id, userId: s.userId, data: { status: s.status } });
return NextResponse.json({ ok: true, status: s.status, createdAt: s.createdAt });
}