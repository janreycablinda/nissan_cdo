import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getVehicles, type Vehicle, type Variant } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Price Guide | Nissan Cagayan de Oro',
  description:
    'View the latest Suggested Retail Prices (SRP) for the complete Nissan lineup, by variant.',
};

// Category display order, matching the rest of the site.
const CATEGORY_ORDER = ['SUVs', 'Cars', 'Vans & Trucks'];

function peso(n: number) {
  return '₱' + n.toLocaleString('en-PH');
}

// A vehicle's variants, or a single fallback row from its base price.
function rowsFor(v: Vehicle): Variant[] {
  if (v.variants.length) return v.variants;
  return [{ name: 'Base', price: v.price_from }];
}

export default async function PriceGuidePage() {
  const vehicles = await getVehicles();

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: vehicles.filter((v) => v.category === category),
  })).filter((g) => g.items.length);

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="bg-nissan-dark py-16 text-white">
        <div className="container-x">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nissan-red">
            Vehicles
          </p>
          <h1 className="mt-2 text-4xl font-light uppercase tracking-wide sm:text-5xl">
            Price Guide
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-300">
            Suggested Retail Prices for the complete Nissan lineup. Choose a variant and request a
            quote from Nissan Cagayan de Oro.
          </p>
        </div>
      </section>

      {/* Groups */}
      <section className="bg-white py-14">
        <div className="container-x space-y-16">
          {groups.map((group) => (
            <div key={group.category}>
              <h2 className="relative inline-block pb-3 text-2xl font-light uppercase tracking-wide text-nissan-dark">
                {group.category}
                <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-nissan-red" />
              </h2>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {group.items.map((v) => {
                  const rows = rowsFor(v);
                  return (
                    <article key={v.id} className="flex flex-col border border-gray-200 sm:flex-row">
                      {/* Image */}
                      <div className="flex items-center justify-center bg-gray-50 p-4 sm:w-44 sm:shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.image_url}
                          alt={v.name}
                          className="max-h-28 max-w-full object-contain"
                        />
                      </div>

                      {/* Pricing */}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-bold uppercase tracking-wide">{v.name}</h3>
                        <table className="mt-3 w-full text-sm">
                          <tbody>
                            {rows.map((r, i) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0">
                                <td className="py-1.5 pr-4 text-nissan-gray">{r.name}</td>
                                <td className="py-1.5 text-right font-semibold text-nissan-dark">
                                  {peso(r.price)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            href="/customer-service/contact-us"
                            className="inline-flex items-center bg-nissan-red px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
                          >
                            Request a Quote
                          </a>
                          {v.brochure_url && (
                            <a
                              href={v.brochure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center border border-nissan-dark px-5 py-2 text-xs font-semibold uppercase tracking-wide text-nissan-dark transition hover:border-nissan-red hover:text-nissan-red"
                            >
                              Brochure
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="border-t border-gray-100 pt-6 text-xs text-nissan-gray">
            Prices are Suggested Retail Prices (SRP) and are subject to change without prior notice.
            Premium paint colors may carry an additional charge. Please contact Nissan Cagayan de Oro
            for the final quotation.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
