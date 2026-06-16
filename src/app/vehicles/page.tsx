import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehiclesList from '@/components/VehiclesList';
import { getVehicles } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vehicles | Nissan Cagayan de Oro',
  description: 'Browse the complete Nissan lineup — cars, vans & trucks, and SUVs.',
};

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <main>
      <Header />
      <section className="bg-nissan-dark py-16 text-white">
        <div className="container-x">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nissan-red">
            The Lineup
          </p>
          <h1 className="mt-2 text-4xl font-light uppercase tracking-wide sm:text-5xl">
            Our Vehicles
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-300">
            Explore every Nissan available at Cagayan de Oro. Filter by body type to find
            the one that fits your journey.
          </p>
        </div>
      </section>
      <VehiclesList vehicles={vehicles} />
      <Footer />
    </main>
  );
}
