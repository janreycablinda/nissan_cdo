import { NextResponse } from 'next/server';
import { listRows, createRow } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { entity: string } }) {
  try {
    return NextResponse.json(await listRows(params.entity));
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: { entity: string } }) {
  try {
    await createRow(params.entity, await req.json());
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
