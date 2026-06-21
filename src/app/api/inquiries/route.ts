import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureEntity } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

// --- Spam protection knobs -------------------------------------------------
const MIN_FILL_MS = 2500; // a human takes at least a couple seconds to fill the form
const RATE_MAX = 5; // max submissions…
const RATE_WINDOW_MS = 10 * 60 * 1000; // …per IP per 10 minutes

// In-memory sliding-window rate limiter. Lives for the lifetime of the server
// process (fine for the single-container deployment).
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = Date.now();

    // 1) Honeypot — a hidden field real users never see. If it's filled, it's a
    //    bot. Pretend success so the bot doesn't retry, but save nothing.
    if (clean(body.website, 200) !== '') {
      return NextResponse.json({ ok: true });
    }

    // 2) Timing trap — submissions faster than a human can type are bots.
    const started = Number(body.started);
    if (Number.isFinite(started) && now - started < MIN_FILL_MS) {
      return NextResponse.json({ ok: true });
    }

    // 3) Per-IP rate limit — blunt the flooding case.
    if (rateLimited(clientIp(req), now)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      );
    }

    const salutation = clean(body.salutation, 20);
    const firstName = clean(body.first_name, 80);
    const lastName = clean(body.last_name, 80);
    const full_name = `${firstName} ${lastName}`.trim().slice(0, 160);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 60);
    const inquiry_type = clean(body.inquiry_type, 60);
    const vehicle = clean(body.vehicle, 120) || null;
    const message = clean(body.message, 4000) || null;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, and mobile number.' },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Make sure the salutation/inquiry_type columns exist on older databases.
    await ensureEntity('inquiries');

    await query(
      'INSERT INTO inquiries (salutation, full_name, email, phone, inquiry_type, vehicle, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [salutation, full_name, email, phone, inquiry_type, vehicle, message],
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
