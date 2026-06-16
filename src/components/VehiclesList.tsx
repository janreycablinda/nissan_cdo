'use client';

import { useState } from 'react';
import type { Vehicle } from '@/lib/data';

const TABS = ['All', 'Cars', 'Vans & Trucks', 'SUVs'] as const;

function peso(n: number) {
  return '₱' + n.toLocaleString('en-PH');
}

export default function VehiclesList({ vehicles }: { vehicles: Vehicle[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');

  const shown = tab === 'All' ? vehicles : vehicles.filter((v) => v.category === tab);

  return (
    <section className="bg-white py-14">
      <div className="container-x">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {TABS.map((t) => {
            const count = t === 'All' ? vehicles.length : vehicles.filter((v) => v.category === t).length;
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

        <p className="mt-4 text-sm text-nissan-gray">
          Showing {shown.length} vehicle{shown.length === 1 ? '' : 's'}
          {tab !== 'All' && ` in ${tab}`}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((v) => (
            <article
              key={v.id}
              className="group flex flex-col border border-gray-200 bg-white transition hover:shadow-lg"
            >
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-50 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 bg-nissan-dark px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {v.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold">{v.name}</h2>
                <p className="mt-1 flex-1 text-sm text-nissan-gray">{v.tagline}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-nissan-gray">Starts at</p>
                <p className="text-lg font-bold text-nissan-red">{peso(v.price_from)}</p>
                <a
                  href="tel:+639177744602"
                  className="mt-4 inline-flex w-fit items-center bg-nissan-red px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
                >
                  Inquire
                </a>
              </div>
            </article>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="mt-8 text-center text-nissan-gray">No vehicles in this category.</p>
        )}
      </div>
    </section>
  );
}
