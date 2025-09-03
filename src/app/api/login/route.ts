import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, seedOnce } from '@/lib/store';
import { randId } from '@/lib/crypto';
import { append } from '@/lib/ledger';


const Body = z.object({ nationalId: z.string().min(6), pin: z.string().min(4).max(12) });


export async function POST(req: NextRequest) {
await seedOnce();
const body = await req.json();
const { nationalId, pin } = Body.parse(body);
const user = await db.findUserByNationalId(nationalId);
if (!user) return NextResponse.json({ ok: false, error: 'USER_NOT_FOUND' }, { status: 404 });


const isNormal = await (await import('argon2')).default.verify(user.pinHash, pin + (process.env.PEPPER_SECRET || 'dev_pepper'));
const isDuress = !isNormal && await (await import('argon2')).default.verify(user.duressPinHash, pin + (process.env.PEPPER_SECRET || 'dev_pepper'));


if (!isNormal && !isDuress) {
return NextResponse.json({ ok: false, error: 'INVALID_PIN' }, { status: 401 });
}


const sessionId = randId('sess');
const status = isDuress ? 'duress' : 'active' as const;


db.addSession({ id: sessionId, userId: user.id, createdAt: Date.now(), status });


if (isDuress) {
db.addIncident({ id: randId('inc'), sessionId, userId: user.id, kind: 'DURESS', createdAt: Date.now(), note: 'Duress PIN used' });
append('LOGIN_DURESS', { sessionId, userId: user.id, data: { nationalId: 'redacted' } });
} else {
append('LOGIN_OK', { sessionId, userId: user.id, data: { nationalId: 'redacted' } });
}


return NextResponse.json({ ok: true, sessionId, status });
}