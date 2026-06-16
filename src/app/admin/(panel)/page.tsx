import Link from 'next/link';
import { ENTITIES } from '@/lib/admin-schema';
import { listRows } from '@/lib/admin-db';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const counts = await Promise.all(
    Object.values(ENTITIES).map(async (e) => {
      try {
        const rows = (await listRows(e.key)) as unknown[];
        return { ...e, count: rows.length };
      } catch {
        return { ...e, count: 0 };
      }
    }),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-nissan-gray">
        Manage the content shown on the homepage. Changes appear immediately on the live site.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((e) => (
          <Link
            key={e.key}
            href={`/admin/${e.key}`}
            className="border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-nissan-red">
              {e.label}
            </p>
            <p className="mt-2 text-3xl font-bold">{e.count}</p>
            <p className="mt-1 text-xs text-nissan-gray">records · click to manage</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
