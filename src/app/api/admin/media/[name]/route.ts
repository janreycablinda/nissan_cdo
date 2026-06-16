import { NextResponse } from 'next/server';
import { deleteMedia } from '@/lib/media';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(_req: Request, { params }: { params: { name: string } }) {
  try {
    await deleteMedia(decodeURIComponent(params.name));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
