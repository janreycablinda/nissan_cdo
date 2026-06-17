'use client';

import { useEffect, useRef, useState } from 'react';
import type { Slide } from '@/lib/data';

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const dragStartX = useRef<number | null>(null);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  const go = (i: number) => setIndex((i + count) % count);

  // Swipe / drag to change slides (touch + mouse via Pointer Events).
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null || count <= 1) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    const THRESHOLD = 50; // ignore small drags / taps so CTA clicks still work
    if (dx > THRESHOLD) go(index - 1);
    else if (dx < -THRESHOLD) go(index + 1);
  };

  return (
    <section
      id="top"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStartX.current = null)}
      style={{ touchAction: 'pan-y' }}
      className="relative h-[78vh] min-h-[460px] w-full cursor-grab touch-pan-y overflow-hidden bg-nissan-dark active:cursor-grabbing"
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${s.image_url}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="container-x relative flex h-full flex-col justify-center text-white">
            {s.kicker && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]">
                {s.kicker}
              </p>
            )}
            <h1 className="text-4xl font-light uppercase leading-[1.05] tracking-wide sm:text-6xl">
              {s.title_line1}
              {s.title_line2 && (
                <>
                  <br />
                  {s.title_line2}
                </>
              )}
            </h1>
            <a
              href={s.cta_href || '#vehicles'}
              className="mt-8 inline-flex w-fit items-center bg-nissan-red px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
            >
              {s.cta_label || 'Discover More'}
            </a>
          </div>
        </div>
      ))}

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-3xl text-white/70 transition hover:text-white sm:block"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 text-3xl text-white/70 transition hover:text-white sm:block"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-[3px] w-10 transition ${
                  i === index ? 'bg-nissan-red' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Down chevron */}
      <a
        href="#vehicles"
        aria-label="Scroll to vehicles"
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-2xl text-white/80 transition hover:text-white"
      >
        ⌄
      </a>
    </section>
  );
}
