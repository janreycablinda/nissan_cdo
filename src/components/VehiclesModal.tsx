'use client';

import { useEffect, useState } from 'react';
import type { Vehicle } from '@/lib/data';
import { vehicleHref } from '@/lib/vehicle-pages';

const TABS = ['All', 'Cars', 'Vans & Trucks', 'SUVs'] as const;

export default function VehiclesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');

  // Lazy-load the lineup the first time the modal opens.
  useEffect(() => {
    if (!open || vehicles !== null) return;
    setLoading(true);
    setError('');
    fetch('/api/vehicles')
      .then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then((d: Vehicle[]) => setVehicles(d))
      .catch(() => setError('Could not load vehicles.'))
      .finally(() => setLoading(false));
  }, [open, vehicles]);

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const list = vehicles ?? [];
  const shown = tab === 'All' ? list : list.filter((v) => v.category === tab);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-white animate-slideDown">
      {/* Sticky bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/nissan_logo.svg" alt="Nissan" className="h-8 w-auto" />
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-nissan-dark">
            Our Vehicles
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-3xl leading-none text-nissan-gray transition hover:text-nissan-dark"
        >
          ×
        </button>
      </div>

      <div className="container-x py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {TABS.map((t) => {
            const count = t === 'All' ? list.length : list.filter((v) => v.category === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  tab === t ? 'bg-nissan-red text-white' : 'text-nissan-gray hover:text-nissan-red'
                }`}
              >
                {t} ({count})
              </button>
            );
          })}
        </div>

        {loading && <p className="py-12 text-center text-nissan-gray">Loading…</p>}
        {error && <p className="py-12 text-center font-semibold text-nissan-red">{error}</p>}

        {!loading && !error && (
          <>
            <p className="mt-4 text-sm text-nissan-gray">
              Showing {shown.length} vehicle{shown.length === 1 ? '' : 's'}
              {tab !== 'All' && ` in ${tab}`}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((v) => {
                const href = vehicleHref(v);
                return (
                <article
                  key={v.id}
                  className="group flex flex-col border border-gray-200 bg-white transition hover:shadow-lg"
                >
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gray-50 p-4">
                    {href ? (
                      <a href={href} onClick={onClose} className="flex h-full w-full items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.image_url}
                          alt={v.name}
                          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      </a>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-3 top-3 bg-nissan-dark px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {v.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-bold">
                      {href ? (
                        <a href={href} onClick={onClose} className="transition hover:text-nissan-red">
                          {v.name}
                        </a>
                      ) : (
                        v.name
                      )}
                    </h2>
                    <p className="mt-1 flex-1 text-sm text-nissan-gray">{v.tagline}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <a
                        href="tel:+639177744602"
                        className="inline-flex w-fit items-center bg-nissan-red px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
                      >
                        Inquire
                      </a>
                      {href && (
                        <a
                          href={href}
                          onClick={onClose}
                          className="inline-flex w-fit items-center border border-nissan-dark px-5 py-2 text-xs font-semibold uppercase tracking-wide text-nissan-dark transition hover:border-nissan-red hover:text-nissan-red"
                        >
                          View Details
                        </a>
                      )}
                    </div>
                  </div>
                </article>
                );
              })}
            </div>

            {shown.length === 0 && (
              <p className="mt-8 text-center text-nissan-gray">No vehicles in this category.</p>
            )}

            {/* View all → full vehicles page */}
            <div className="mt-12 border-t border-gray-200 pt-8 text-center">
              <a
                href="/vehicles"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-nissan-dark px-8 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-nissan-red"
              >
                View All Vehicles ›
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
