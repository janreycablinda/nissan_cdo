import { NextResponse } from 'next/server';
import { updateRow, deleteRow } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { entity: string; id: string } }) {
  try {
    await updateRow(params.entity, params.id, await req.json());
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { entity: string; id: string } }) {
  try {
    await deleteRow(params.entity, params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
