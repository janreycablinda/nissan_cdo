'use client';

import { useState } from 'react';
import VehiclesModal from './VehiclesModal';

const NAV: { label: string; href?: string; vehicles?: boolean }[] = [
  { label: 'Vehicles', vehicles: true },
  { label: 'Owners', href: '/#offers' },
  { label: 'Services', href: '/#offers' },
  { label: 'Finance', href: '/#offers' },
  { label: 'Nissan Brand', href: '/#offers' },
  { label: 'Resources', href: '/vehicles/brochures' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top utility bar */}
      <div className="bg-nissan-red text-white">
        <div className="container-x flex h-8 items-center justify-between text-[11px] tracking-wide">
          <span>
            Give us a call now: (Sales){' '}
            <a href="tel:09177744602" className="hover:underline">0917-774-4602</a>, (Service){' '}
            <a href="tel:09176218445" className="hover:underline">0917-621-8445</a>
          </span>
          <nav className="hidden items-center gap-3 uppercase md:flex">
            <a href="#" className="hover:underline">At-Home Shopping</a>
            <span className="opacity-50">|</span>
            <a href="/#offers" className="hover:underline">Nissan Intelligent Mobility</a>
            <span className="opacity-50">|</span>
            <a
              href="https://facebook.com/nissancdoservice"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase hover:underline"
            >
              Book a Service
            </a>
          </nav>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-gray-100 shadow-sm">
        <div className="container-x flex h-[68px] items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/nissan_logo.svg" alt="Nissan" className="h-12 w-auto" />
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-nissan-dark">
              Cagayan de Oro
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) =>
              item.vehicles ? (
                <button
                  key={item.label}
                  onClick={() => setMenuOpen(true)}
                  className="text-xs font-semibold uppercase tracking-wide text-nissan-gray transition hover:text-nissan-red"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs font-semibold uppercase tracking-wide text-nissan-gray transition hover:text-nissan-red"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <a
            href="https://facebook.com/nissancdo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden bg-nissan-red px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 lg:inline-block"
          >
            Request a Quote
          </a>

          {/* Hamburger toggle (mobile / tablet) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center text-nissan-dark lg:hidden"
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <nav className="border-t border-gray-100 lg:hidden">
            <div className="container-x flex flex-col py-2">
              {NAV.map((item) =>
                item.vehicles ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMobileOpen(false);
                      setMenuOpen(true);
                    }}
                    className="py-3 text-left text-sm font-semibold uppercase tracking-wide text-nissan-gray transition hover:text-nissan-red"
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-sm font-semibold uppercase tracking-wide text-nissan-gray transition hover:text-nissan-red"
                  >
                    {item.label}
                  </a>
                ),
              )}
              <a
                href="https://facebook.com/nissancdo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 bg-nissan-red px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
              >
                Request a Quote
              </a>
            </div>
          </nav>
        )}
      </div>

      <VehiclesModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
