export type SessionStatus = 'active' | 'duress' | 'ended';


export interface Session {
id: string;
userId: string;
createdAt: number; // ms
status: SessionStatus;
}


export interface Incident {
id: string;
sessionId: string;
userId: string;
kind: 'DURESS' | 'INFO';
createdAt: number;
note?: string;
}


export interface LedgerEntry {
id: string;
ts: number;
type: 'LOGIN_OK' | 'LOGIN_DURESS' | 'VERIFY' | 'END_SESSION';
sessionId?: string;
userId?: string;
data?: Record<string, unknown>;
prevHash: string; // previous entry hash
hash: string; // current entry hash
}