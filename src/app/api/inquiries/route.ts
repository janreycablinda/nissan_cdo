import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const full_name = String(body.full_name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const vehicle = String(body.vehicle || '').trim() || null;
    const message = String(body.message || '').trim() || null;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 },
      );
    }

    await query(
      'INSERT INTO inquiries (full_name, email, phone, vehicle, message) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, phone, vehicle, message],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('inquiry error', err);
    return NextResponse.json(
      { error: 'Could not save your inquiry. Please try again.' },
      { status: 500 },
    );
  }
}
