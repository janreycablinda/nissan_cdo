import crypto from 'crypto';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { USERS_TABLE, ENSURE_USERS_TABLE } from '@/lib/admin-schema';

export const COOKIE = 'admin_session';

export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nissan123';

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';

export type Role = 'admin' | 'editor';
export type Session = { username: string; role: Role };

export { USERS_TABLE };

async function ensureUsersTable(): Promise<void> {
  await query(ENSURE_USERS_TABLE);
}

// --- Signed session token: `payload.signature`, payload = base64url(JSON) ---
// The signature binds the username + role to the server secret so the cookie
// can't be forged or tampered with. Mirrored (read-only) in src/middleware.ts.

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function createSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(token?: string): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof obj?.username !== 'string') return null;
    return { username: obj.username, role: obj.role === 'admin' ? 'admin' : 'editor' };
  } catch {
    return null;
  }
}

// The session of the currently signed-in admin, read from the request cookie.
export function currentSession(): Session | null {
  return readSession(cookies().get(COOKIE)?.value);
}

// --- Password hashing (scrypt, no external deps) ---

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const candidate = crypto.scryptSync(password, salt, 64);
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

// --- Authentication ---
// The .env ADMIN_USER/ADMIN_PASSWORD is a permanent full-admin backdoor.
// Everyone else is matched against the admin_users table.
export async function authenticate(username: string, password: string): Promise<Session | null> {
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    return { username, role: 'admin' };
  }

  await ensureUsersTable();
  const rows = await query<{ username: string; role: string; password_hash: string }>(
    `SELECT username, role, password_hash FROM ${USERS_TABLE} WHERE username = ? LIMIT 1`,
    [username],
  );
  const u = rows[0];
  if (!u || !verifyPassword(password, u.password_hash)) return null;
  return { username: u.username, role: u.role === 'admin' ? 'admin' : 'editor' };
}
