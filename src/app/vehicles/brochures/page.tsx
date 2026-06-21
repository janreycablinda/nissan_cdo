import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBrochureVehicles } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Download Brochures | Nissan Cagayan de Oro',
  description:
    'Download the latest Nissan vehicle brochures — full specs, features and trim details for the complete lineup.',
};

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default async function BrochuresPage() {
  const vehicles = await getBrochureVehicles();

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="bg-nissan-dark py-16 text-white">
        <div className="container-x">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nissan-red">
            Resources
          </p>
          <h1 className="mt-2 text-4xl font-light uppercase tracking-wide sm:text-5xl">
            Download Brochure
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-300">
            Get the full specs, features and trim details for every Nissan. Download a
            brochure to explore your next vehicle at your own pace.
          </p>
        </div>
      </section>

      {/* Brochure grid */}
      <section className="bg-white py-14">
        <div className="container-x">
          {vehicles.length === 0 ? (
            <p className="py-12 text-center text-nissan-gray">
              No brochures available right now. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vehicles.map((v) => (
                <article
                  key={v.id}
                  className="group flex flex-col border border-gray-200 bg-white transition hover:shadow-lg"
                >
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gray-50 p-4">
                    {v.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-center text-2xl font-light uppercase tracking-wide text-gray-300">
                        {v.name}
                      </span>
                    )}
                    <span className="absolute left-3 top-3 bg-nissan-dark px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {v.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-bold uppercase tracking-wide">{v.name}</h2>
                    <p className="mt-1 flex-1 text-sm text-nissan-gray">PDF Brochure</p>

                    <div className="mt-4">
                      {v.brochure_url ? (
                        <a
                          href={v.brochure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-nissan-red px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
                        >
                          <DownloadIcon />
                          Download
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-gray-100 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-nissan-gray">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
