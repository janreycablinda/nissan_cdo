'use client';

import { useState } from 'react';

export default function ChangePasswordPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setDone(false);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    if (data.newPassword !== data.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Could not change password.');
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">Change Password</h1>
      <p className="mt-1 text-sm text-nissan-gray">
        Update the password used to sign in to the control panel.
      </p>

      <form onSubmit={onSubmit} className="mt-8 bg-white p-6 shadow-sm">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">
          Current Password
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="mb-4 w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">
          New Password
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mb-4 w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">
          Confirm New Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mb-6 w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-nissan-red px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'Updating…' : 'Update Password'}
        </button>

        {error && <p className="mt-4 text-sm font-semibold text-nissan-red">{error}</p>}
        {done && (
          <p className="mt-4 text-sm font-semibold text-green-600">
            Password updated. Use it the next time you sign in.
          </p>
        )}
      </form>
    </div>
  );
}
