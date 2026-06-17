import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE, authenticate, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));

  const session = await authenticate(username, password);
  if (session) {
    cookies().set(COOKIE, createSession(session), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
}
