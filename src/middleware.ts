import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge-runtime auth gate. Mirrors src/lib/auth.ts but uses Web Crypto
// (the Node `crypto` module isn't available in middleware).
const COOKIE = 'admin_session';
const PAYLOAD = 'admin-authenticated';

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function expectedToken(): Promise<string> {
  const secret = process.env.AUTH_SECRET || 'dev-secret-change-me';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(PAYLOAD));
  return toHex(sig);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public auth endpoints — always allowed.
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  const authed = !!token && token === (await expectedToken());

  if (authed) return NextResponse.next();

  // Unauthenticated: APIs get 401, pages redirect to the login screen.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
