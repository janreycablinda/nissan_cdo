import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import VehicleRange from '@/components/VehicleRange';
import QuickLinks from '@/components/QuickLinks';
import SafeMobility from '@/components/SafeMobility';
import SpecialOffers from '@/components/SpecialOffers';
import Footer from '@/components/Footer';
import { getVehicles, getOffers, getSlides } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [slides, vehicles, offers] = await Promise.all([
    getSlides(),
    getVehicles(),
    getOffers(),
  ]);

  return (
    <main>
      <Header />
      <HeroSlider slides={slides} />
      <VehicleRange vehicles={vehicles} />
      <QuickLinks />
      {/* <SafeMobility /> */}
      <SpecialOffers offers={offers} />
      <Footer />
    </main>
  );
}
