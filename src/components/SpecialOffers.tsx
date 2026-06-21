import type { Offer } from '@/lib/data';
import SectionHeading from './SectionHeading';

export default function SpecialOffers({ offers }: { offers: Offer[] }) {
  return (
    <section id="offers" className="bg-white py-16">
      <div className="container-x">
        <SectionHeading>SPECIAL OFFERS AND EVENTS</SectionHeading>

        {/* Feature banner */}
        <a
          className="relative mt-8 flex h-48 items-center overflow-hidden bg-nissan-dark sm:h-56 lg:h-[612px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://nissancagayandeoro.com/images/uploads/NEW-DESKTOP-1782055794850.jpg')",
            }}
          />
          <div className="relative text-center z-10 px-8 text-black sm:px-12 w-full">
            <h3 className="text-2xl font-light text-center tracking-wide sm:text-3xl">
              NISSAN INTELLIGENT MOBILITY TOUR 5.0
            </h3>
            <p className="mt-2 w-full text-center text-black text-sm uppercase tracking-wide text-gray-200">
              Experience a new era of excitement as Nissan shapes the future of mobility through technology
            </p>
          </div>
        </a>

        {/* Offer cards */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {offers.map((o) => (
            <div key={o.id} className="flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.image_url} alt={o.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 text-xs text-nissan-gray">{o.caption}</p>
              <h4 className="mt-1 text-sm font-semibold uppercase tracking-wide text-nissan-dark">
                {o.title}
              </h4>
              <a
                href="#vehicles"
                className="mt-4 inline-flex w-fit items-center gap-1 bg-nissan-red px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
              >
                Learn More ›
              </a>
            </div>
          ))}
        </div>

        {/* Newsroom */}
        <div className="mt-14 text-center">
          <p className="text-xs uppercase tracking-wide text-nissan-gray">
            Read more from the official Nissan Philippines newsroom
          </p>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1 bg-nissan-red px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
          >
            Learn More ›
          </a>
        </div>
      </div>
    </section>
  );
}
