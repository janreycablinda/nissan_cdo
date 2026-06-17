import { NextResponse } from 'next/server';
import {
  USERS_TABLE,
  authenticate,
  currentSession,
  hashPassword,
} from '@/lib/auth';
import { query } from '@/lib/db';

// Protected by middleware — only a signed-in admin can reach this.
// Changes the password of whoever is currently logged in.
export async function POST(req: Request) {
  const session = currentSession();
  if (!session) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Current and new password are both required.' },
      { status: 400 },
    );
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return NextResponse.json(
      { error: 'New password must be at least 6 characters.' },
      { status: 400 },
    );
  }

  // Re-verify the current password for the logged-in user.
  if (!(await authenticate(session.username, currentPassword))) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  const rows = await query<{ id: number }>(
    `SELECT id FROM ${USERS_TABLE} WHERE username = ? LIMIT 1`,
    [session.username],
  );
  if (rows.length === 0) {
    return NextResponse.json(
      {
        error:
          "This is the built-in admin account; its password is set via environment configuration and can't be changed here. Create a user account under Admin Users to manage passwords.",
      },
      { status: 400 },
    );
  }

  await query(`UPDATE ${USERS_TABLE} SET password_hash = ? WHERE username = ?`, [
    hashPassword(newPassword),
    session.username,
  ]);

  return NextResponse.json({ ok: true });
}
