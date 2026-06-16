import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const vehicles = await getVehicles();
  return NextResponse.json(vehicles);
}
