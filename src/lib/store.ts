import { Session, Incident } from './types';
import { hashPin } from './crypto';


interface User {
id: string;
nationalId: string; // SA ID number or similar identifier
pinHash: string; // normal PIN
duressPinHash: string; // duress PIN
}


const users: User[] = [];
const sessions: Session[] = [];
const incidents: Incident[] = [];


// seed one demo user at cold start
let seeded = false;
export async function seedOnce() {
if (seeded) return;
const u: User = {
id: 'u_demo_1',
nationalId: '8001015009087',
pinHash: await hashPin('1234'),
duressPinHash: await hashPin('9876'),
};
users.push(u);
seeded = true;
}


export const db = {
users,
sessions,
incidents,
async findUserByNationalId(nationalId: string) {
return users.find(u => u.nationalId === nationalId) || null;
},
addSession(s: Session) { sessions.push(s); return s; },
updateSession(id: string, patch: Partial<Session>) {
const i = sessions.findIndex(s => s.id === id);
if (i >= 0) sessions[i] = { ...sessions[i], ...patch };
return sessions[i] || null;
},
addIncident(i: Incident) { incidents.push(i); return i; },
};