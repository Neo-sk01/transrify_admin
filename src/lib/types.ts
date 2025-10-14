// Transrify API Types
export type SessionResult = 'NORMAL' | 'FAIL' | 'DURESS';
export type IncidentStatus = 'OPEN' | 'CLOSED';

export interface TransrifySession {
  id: string;
  tenant_id: string;
  customer_id: string;
  result: SessionResult;
  created_at: string;
}

export interface TransrifyIncident {
  id: string;
  session_id: string;
  tenant_id: string;
  customer_id: string;
  status: IncidentStatus;
  lat: string;
  lng: string;
  created_at: string;
}

export interface TransrifyEventLog {
  id: string;
  tenant_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface TransrifyAdminState {
  sessions: TransrifySession[];
  incidents: TransrifyIncident[];
  eventLogs: TransrifyEventLog[];
}

// Legacy types (keeping for backward compatibility)
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