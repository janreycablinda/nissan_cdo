import Link from 'next/link';
import { ENTITIES } from '@/lib/admin-schema';
import { unreadCount } from '@/lib/admin-db';
import { currentSession } from '@/lib/auth';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = currentSession();
  const isAdmin = session?.role === 'admin';
  const entities = Object.values(ENTITIES).filter((e) => !e.adminOnly || isAdmin);

  // Unread counts for entities that track read/unread (e.g. Inquiries).
  const unread: Record<string, number> = {};
  await Promise.all(
    entities
      .filter((e) => e.readColumn)
      .map(async (e) => {
        unread[e.key] = await unreadCount(e.key);
      }),
  );

  return (
    <div className="flex min-h-screen bg-nissan-light">
      <aside className="flex w-60 flex-col bg-nissan-dark p-5 text-white">
        <Link href="/admin" className="mb-8 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/nissan_logo.svg" alt="Nissan" className="h-8 w-auto brightness-0 invert" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]">Admin</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          <Link
            href="/admin"
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>
          {entities.map((e) => (
            <Link
              key={e.key}
              href={`/admin/${e.key}`}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <span>{e.label}</span>
              {unread[e.key] > 0 && (
                <span className="ml-2 inline-block rounded-full bg-nissan-red px-2 py-0.5 text-[10px] font-bold text-white">
                  {unread[e.key]}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/admin/media"
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Media Library
          </Link>
          <a
            href="/"
            target="_blank"
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/50 transition hover:text-white"
          >
            View Site ↗
          </a>
        </nav>

        {/* Account actions */}
        <div className="mt-6 border-t border-white/10 pt-4">
          {session && (
            <p className="mb-3 px-3 text-[10px] uppercase tracking-wide text-white/40">
              {session.username} · {session.role}
            </p>
          )}
          <Link
            href="/admin/password"
            className="mb-2 block px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Change Password
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6 sm:p-10">{children}</main>
    </div>
  );
}
