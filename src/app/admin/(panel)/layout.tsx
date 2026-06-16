import Link from 'next/link';
import { ENTITIES } from '@/lib/admin-schema';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
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
          {Object.values(ENTITIES).map((e) => (
            <Link
              key={e.key}
              href={`/admin/${e.key}`}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {e.label}
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

        <LogoutButton />
      </aside>

      <main className="flex-1 overflow-x-auto p-6 sm:p-10">{children}</main>
    </div>
  );
}
