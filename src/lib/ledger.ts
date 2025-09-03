import fs from 'fs';
import path from 'path';
import { sha256Hex, randId } from './crypto';
import type { LedgerEntry } from './types';


const DATA_DIR = path.join(process.cwd(), 'data');
const LEDGER_FILE = path.join(DATA_DIR, 'ledger.jsonl');


function ensureFiles() {
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(LEDGER_FILE)) fs.writeFileSync(LEDGER_FILE, '');
}


function lastHash(): string {
ensureFiles();
const buf = fs.readFileSync(LEDGER_FILE, 'utf8');
const lines = buf.trim().split('\n').filter(Boolean);
if (!lines.length) return 'GENESIS';
const last = JSON.parse(lines[lines.length - 1]) as LedgerEntry;
return last.hash;
}


export function append(type: LedgerEntry['type'], payload: Omit<LedgerEntry, 'id'|'ts'|'prevHash'|'hash'|'type'>) {
ensureFiles();
const prev = lastHash();
const base = {
id: randId('led'),
ts: Date.now(),
type,
...payload,
} as Omit<LedgerEntry, 'prevHash'|'hash'> & { type: LedgerEntry['type'] };
const input = JSON.stringify({ id: base.id, ts: base.ts, type: base.type, sessionId: base.sessionId, userId: base.userId, data: base.data });
const hash = sha256Hex(prev + input);
const entry: LedgerEntry = { ...base, prevHash: prev, hash };
fs.appendFileSync(LEDGER_FILE, JSON.stringify(entry) + '\n');
return entry;
}


export function readAll(): LedgerEntry[] {
ensureFiles();
const buf = fs.readFileSync(LEDGER_FILE, 'utf8');
return buf.split('\n').filter(Boolean).map(l => JSON.parse(l));
}