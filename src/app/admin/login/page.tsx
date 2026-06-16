'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed.');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-nissan-light px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/nissan_logo.svg" alt="Nissan" className="h-9 w-auto" />
          <span className="text-sm font-semibold uppercase tracking-[0.15em]">
            Control Panel
          </span>
        </div>
        <h1 className="mb-1 text-xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-nissan-gray">Enter your admin credentials.</p>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">
          Username
        </label>
        <input
          name="username"
          required
          autoComplete="username"
          className="mb-4 w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-6 w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-nissan-red px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign In'}
        </button>

        {error && <p className="mt-4 text-sm font-semibold text-nissan-red">{error}</p>}
      </form>
    </main>
  );
}
