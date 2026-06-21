'use client';

import { useEffect, useRef, useState } from 'react';

const SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Rev.'];
const INQUIRY_TYPES = [
  'Vehicles',
  'Test Drive',
  'Parts & Accessories',
  'Service',
  'Warranty',
  'Other',
];

const fieldClass =
  'w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-nissan-red focus:outline-none';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-nissan-dark';

export default function ContactForm({ vehicles }: { vehicles: string[] }) {
  const empty = {
    salutation: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    inquiry_type: '',
    vehicle: '',
    message: '',
    website: '', // honeypot — must stay empty
  };
  const [form, setForm] = useState(empty);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const startedRef = useRef(0);

  // Stamp when the form became interactive — the API rejects submissions that
  // arrive implausibly fast (bots).
  useEffect(() => {
    startedRef.current = Date.now();
  }, []);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, started: startedRef.current }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Something went wrong.');
      setDone(true);
      setForm(empty);
      setConsent(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-xl font-bold text-nissan-dark">Thank you!</h3>
        <p className="mt-2 text-sm text-nissan-gray">
          Your message has been received. Our team will get back to you shortly.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-5 inline-flex items-center bg-nissan-red px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      {/* Honeypot: hidden from users, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label className={labelClass}>Salutation</label>
        <select value={form.salutation} onChange={(e) => set('salutation', e.target.value)} className={fieldClass}>
          <option value="">Select…</option>
          {SALUTATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block" />

      <div>
        <label className={labelClass}>
          First Name <span className="text-nissan-red">*</span>
        </label>
        <input type="text" required value={form.first_name} onChange={(e) => set('first_name', e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>
          Last Name <span className="text-nissan-red">*</span>
        </label>
        <input type="text" required value={form.last_name} onChange={(e) => set('last_name', e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>
          Email <span className="text-nissan-red">*</span>
        </label>
        <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>
          Mobile Number <span className="text-nissan-red">*</span>
        </label>
        <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="09XX XXX XXXX" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>
          Type of Inquiry <span className="text-nissan-red">*</span>
        </label>
        <select required value={form.inquiry_type} onChange={(e) => set('inquiry_type', e.target.value)} className={fieldClass}>
          <option value="">Select…</option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Vehicle of Interest</label>
        <select value={form.vehicle} onChange={(e) => set('vehicle', e.target.value)} className={fieldClass}>
          <option value="">Select…</option>
          {vehicles.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>Message</label>
        <textarea rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} className={fieldClass} />
      </div>

      <label className="sm:col-span-2 flex items-start gap-2 text-xs text-nissan-gray">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-nissan-red"
        />
        <span>
          I agree that my details will be used to respond to my inquiry, in accordance with the
          Nissan Privacy Policy.
        </span>
      </label>

      {error && <p className="sm:col-span-2 text-sm font-semibold text-nissan-red">{error}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center bg-nissan-red px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
