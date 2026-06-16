import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_USER, ADMIN_PASSWORD, COOKIE, sessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));

  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    cookies().set(COOKIE, sessionToken(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
}
