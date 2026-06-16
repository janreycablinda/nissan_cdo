import { notFound } from 'next/navigation';
import { ENTITIES } from '@/lib/admin-schema';
import { listRows } from '@/lib/admin-db';
import AdminEntity from '@/components/admin/AdminEntity';

export const dynamic = 'force-dynamic';

export default async function EntityPage({ params }: { params: { entity: string } }) {
  const config = ENTITIES[params.entity];
  if (!config) notFound();

  const rows = (await listRows(params.entity)) as Record<string, unknown>[];

  return (
    <AdminEntity
      entityKey={config.key}
      label={config.label}
      fields={config.fields}
      rows={rows}
    />
  );
}
