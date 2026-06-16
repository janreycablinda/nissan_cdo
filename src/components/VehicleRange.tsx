'use client';

import { useState } from 'react';
import type { Vehicle } from '@/lib/data';
import { vehicleHref } from '@/lib/vehicle-pages';
import SectionHeading from './SectionHeading';

const TABS = ['Vehicles', 'Cars', 'Vans & Trucks', 'SUVs'] as const;

export default function VehicleRange({ vehicles }: { vehicles: Vehicle[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Vehicles');

  const shown =
    tab === 'Vehicles' ? vehicles : vehicles.filter((v) => v.category === tab);

  return (
    <section id="vehicles" className="bg-white py-16">
      <div className="container-x">
        <SectionHeading>View Our Vehicle Range</SectionHeading>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                tab === t
                  ? 'bg-nissan-red text-white'
                  : 'text-nissan-gray hover:text-nissan-red'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {shown.map((v) => (
            <a key={v.id} href={vehicleHref(v) ?? '#vehicles'} className="group flex flex-col items-center text-center">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-nissan-dark group-hover:text-nissan-red">
                {v.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
