import { notFound } from 'next/navigation';
import { ENTITIES } from '@/lib/admin-schema';
import { listRows } from '@/lib/admin-db';
import { currentSession } from '@/lib/auth';
import AdminEntity from '@/components/admin/AdminEntity';

export const dynamic = 'force-dynamic';

export default async function EntityPage({ params }: { params: { entity: string } }) {
  const config = ENTITIES[params.entity];
  if (!config) notFound();
  if (config.adminOnly && currentSession()?.role !== 'admin') notFound();

  const rows = (await listRows(params.entity)) as Record<string, unknown>[];

  return (
    <AdminEntity
      entityKey={config.key}
      label={config.label}
      fields={config.fields}
      rows={rows}
      readColumn={config.readColumn}
      allowClone={!config.disableClone && !config.readOnly}
      readOnly={!!config.readOnly}
    />
  );
}
