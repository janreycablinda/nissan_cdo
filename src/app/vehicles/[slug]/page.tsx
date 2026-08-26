import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { getVehicleBySlug } from '@/lib/data';
import { resolveContent } from '@/lib/vehicle-content';

// Content is edited in /admin and read at request time, so never cache.
export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug);
  if (!vehicle) return { title: 'Vehicle Not Found | Nissan Cagayan de Oro' };

  const c = resolveContent(vehicle);
  return {
    title: `Nissan ${vehicle.name} | Nissan Cagayan de Oro`,
    description: vehicle.tagline || c.introBody.slice(0, 160),
  };
}

export default async function VehiclePage({ params }: Props) {
  const vehicle = await getVehicleBySlug(params.slug);
  if (!vehicle) notFound();

  const c = resolveContent(vehicle);

  const actions = [
    {
      label: 'Download a Brochure',
      href: vehicle.brochure_url || '/vehicles/brochures',
    },
    { label: 'Book a Test Drive', href: '/#contact' },
    { label: 'Request a Quote', href: '/#contact' },
    { label: 'Visit Price Guide Page', href: '/vehicles/new/price-guide' },
  ];

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="relative h-[78vh] min-h-[460px] w-full overflow-hidden bg-nissan-dark">
        {/* Both fit classes are written out literally so Tailwind's JIT keeps them. */}
        <div
          className={`absolute inset-0 bg-center bg-no-repeat opacity-90 ${
            c.heroFit === 'cover' ? 'bg-cover' : 'bg-contain'
          }`}
          style={{ backgroundImage: `url('${c.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="container-x relative flex h-full flex-col justify-end pb-16 text-white">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-300">
            {c.heroKicker}
          </p>
          <h1 className="text-4xl font-light uppercase leading-[1.05] tracking-wide sm:text-6xl">
            {c.heroTitle}
          </h1>
          {c.heroSubtitle && (
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-200">
              {c.heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Intro band */}
      <section className="bg-nissan-dark py-16 text-white">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="relative inline-block pb-3 text-2xl font-light uppercase tracking-wide sm:text-[28px]">
              {c.introHeading}
              <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-nissan-red" />
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">{c.introBody}</p>
        </div>
      </section>

      {/* Feature sections */}
      {c.features.map((f, i) => (
        <section
          key={`${f.label}-${i}`}
          className="relative flex min-h-[460px] items-center overflow-hidden bg-nissan-dark py-16 text-white"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-55"
            style={{ backgroundImage: `url('${f.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

          {/* Vertical side label */}
          <span className="absolute left-0 top-0 flex h-full w-8 items-center justify-center bg-nissan-red/90 text-[10px] font-semibold uppercase tracking-[0.25em] text-white [writing-mode:vertical-rl] sm:w-10">
            {f.label}
          </span>

          <div className="container-x relative">
            <div className="max-w-xl pl-10 sm:pl-12">
              <h2 className="text-3xl font-light uppercase leading-tight tracking-wide sm:text-4xl">
                {/* Each newline in the admin field becomes a rendered line break. */}
                {f.title.split('\n').map((line, li) => (
                  <span key={li} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-200">{f.body}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/#offers" className="btn-outline">
                  Read More
                </a>
                <a href="/#contact" className="btn-outline">
                  Book a Test Drive
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Genuine Accessories */}
      <section className="bg-white py-16">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading>{c.accessoriesHeading}</SectionHeading>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-nissan-gray">
              {c.accessoriesBody}
            </p>
            <a href="/#offers" className="btn-primary mt-7">
              Read More
            </a>
          </div>
          <div>
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${c.accessoriesImage}')` }}
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-nissan-dark">
              {c.accessoriesCaption}
            </p>
            <p className="mt-1 text-xs text-nissan-gray">{c.accessoriesNote}</p>
          </div>
        </div>
      </section>

      {/* Warranty */}
      <section className="bg-nissan-light py-16">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nissan-gray">
              Warranty
            </p>
            <h2 className="mt-3 text-2xl font-light uppercase tracking-wide text-nissan-dark sm:text-3xl">
              {c.warrantyHeading}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-nissan-gray">
              {c.warrantyBody}
            </p>
            <a href="/#offers" className="btn-primary mt-7">
              Read More
            </a>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="text-nissan-dark">
              <span className="text-7xl font-extrabold leading-none tracking-tighter sm:text-8xl">
                {c.warrantyYears}
              </span>
              <span className="ml-1 align-top text-4xl font-extrabold uppercase sm:text-5xl">
                Year
              </span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-nissan-red">
                Nissan Warranty
              </p>
              {c.warrantyNote && (
                <p className="text-[11px] uppercase tracking-wide text-nissan-gray">
                  {c.warrantyNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What would you like to do? */}
      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="text-center text-2xl font-light uppercase tracking-wide text-nissan-dark sm:text-[28px]">
            What Would You Like to Do?
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {actions.map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="group flex flex-col items-center text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gray-300 text-nissan-red transition group-hover:border-nissan-red">
                  ›
                </span>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-nissan-dark transition group-hover:text-nissan-red">
                  {a.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
