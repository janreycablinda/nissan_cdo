import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_ONLY_ENTITY_KEYS } from '@/lib/admin-schema';

// Edge-runtime auth gate. Mirrors the session logic in src/lib/auth.ts but uses
// Web Crypto (the Node `crypto` module isn't available in middleware).
const COOKIE = 'admin_session';

type Session = { username: string; role: 'admin' | 'editor' };

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sign(payload: string): Promise<string> {
  const secret = process.env.AUTH_SECRET || 'dev-secret-change-me';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toHex(sig);
}

function decodePayload(b64url: string): Session | null {
  try {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
    const obj = JSON.parse(atob(b64 + pad));
    if (typeof obj?.username !== 'string') return null;
    return { username: obj.username, role: obj.role === 'admin' ? 'admin' : 'editor' };
  } catch {
    return null;
  }
}

async function readSession(token?: string): Promise<Session | null> {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  if (sig !== (await sign(payload))) return null;
  return decodePayload(payload);
}

// Does this path target an admin-only entity's page or API?
function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_ENTITY_KEYS.some((k) =>
    [`/admin/${k}`, `/api/admin/${k}`].some(
      (base) => pathname === base || pathname.startsWith(`${base}/`),
    ),
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith('/api/');

  // Public auth endpoints — always allowed.
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const session = await readSession(req.cookies.get(COOKIE)?.value);

  // Unauthenticated: APIs get 401, pages redirect to the login screen.
  if (!session) {
    if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Authenticated but not an admin: block admin-only areas (e.g. user management).
  if (isAdminOnlyPath(pathname) && session.role !== 'admin') {
    if (isApi) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
