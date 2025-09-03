import { createHash, randomBytes } from 'crypto';
import argon2 from 'argon2';


const PEPPER = process.env.PEPPER_SECRET || 'dev_pepper';


export function sha256Hex(input: string): string {
return createHash('sha256').update(input).digest('hex');
}


export async function hashPin(pin: string) {
return argon2.hash(pin + PEPPER, { type: argon2.argon2id });
}


export async function verifyPin(stored: string, pinAttempt: string) {
return argon2.verify(stored, pinAttempt + PEPPER);
}


export function randId(prefix = '') {
return (prefix ? prefix + '_' : '') + randomBytes(10).toString('hex');
}