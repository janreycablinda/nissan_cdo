import crypto from 'crypto';

export const COOKIE = 'admin_session';

export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nissan123';

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';
const PAYLOAD = 'admin-authenticated';

// A signed, forge-proof session token derived from the server secret.
export function sessionToken(): string {
  return crypto.createHmac('sha256', SECRET).update(PAYLOAD).digest('hex');
}

export function isValidToken(token?: string): boolean {
  if (!token) return false;
  const expected = sessionToken();
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
