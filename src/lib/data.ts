import { query } from './db';
import { ensureEntity } from './admin-db';

export type Vehicle = {
  id: number;
  name: string;
  category: string;
  tagline: string;
  price_from: number;
  image_url: string;
  brochure_url: string;
  show_in_menu: number; // 1 = shown on menu & homepage
  show_in_brochures: number; // 1 = shown on the brochure page
};

export type Slide = {
  id: number;
  kicker: string;
  title_line1: string;
  title_line2: string | null;
  image_url: string;
  cta_label: string;
  cta_href: string;
};

export type Offer = {
  id: number;
  title: string;
  caption: string;
  image_url: string;
};

export type Social = {
  id: number;
  platform: string;
  url: string;
};

// Fallback data so the homepage still renders if MySQL is unreachable
// (e.g. running `next dev` before `docker compose up`).
const CDN_BROCHURES = 'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures';

const FALLBACK_VEHICLES: Vehicle[] = [
  { id: 1, name: 'Kicks e-POWER', category: 'SUVs', tagline: 'Electric drive. No charging needed.', price_from: 1209000, image_url: '/images/vehicles/Kicks.png', brochure_url: `${CDN_BROCHURES}/kicks_brochure.pdf`, show_in_menu: 1, show_in_brochures: 1 },
  { id: 2, name: 'Urvan', category: 'Vans & Trucks', tagline: 'Move more. Do more.', price_from: 1850000, image_url: '/images/vehicles/URVAN.jpg', brochure_url: '', show_in_menu: 1, show_in_brochures: 1 },
  { id: 3, name: 'Patrol', category: 'SUVs', tagline: 'The ultimate flagship SUV.', price_from: 4900000, image_url: '/images/vehicles/PATROL.jpg', brochure_url: `${CDN_BROCHURES}/patrol_brochure.pdf`, show_in_menu: 1, show_in_brochures: 1 },
  { id: 4, name: 'Almera', category: 'Cars', tagline: 'Bold, efficient, and turbocharged.', price_from: 768000, image_url: '/images/vehicles/almera.png', brochure_url: `${CDN_BROCHURES}/almera_brochure.pdf`, show_in_menu: 1, show_in_brochures: 1 },
  { id: 5, name: 'Terra', category: 'SUVs', tagline: 'Adventure, redefined.', price_from: 1779000, image_url: '/images/vehicles/Terra.jpg', brochure_url: `${CDN_BROCHURES}/terra_brochure.pdf`, show_in_menu: 1, show_in_brochures: 1 },
  { id: 6, name: 'Navara', category: 'Vans & Trucks', tagline: 'Built to dominate every terrain.', price_from: 1199000, image_url: '/images/vehicles/Navara.png', brochure_url: `${CDN_BROCHURES}/navara_brochure.pdf`, show_in_menu: 1, show_in_brochures: 1 },
  { id: 7, name: 'Livina', category: 'Cars', tagline: 'Seven seats. Endless possibilities.', price_from: 1029000, image_url: '/images/vehicles/Livina.png', brochure_url: `${CDN_BROCHURES}/livina_brochure.pdf`, show_in_menu: 1, show_in_brochures: 1 },
];

const FALLBACK_SLIDES: Slide[] = [
  { id: 1, kicker: 'The All-New Nissan Patrol', title_line1: 'Dare to Be', title_line2: 'Exceptional', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1920&q=75', cta_label: 'Discover More', cta_href: '#vehicles' },
  { id: 2, kicker: 'The Nissan Navara', title_line1: 'Built to', title_line2: 'Dominate', image_url: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1920&q=75', cta_label: 'Discover More', cta_href: '#vehicles' },
  { id: 3, kicker: 'The Nissan Terra', title_line1: 'Adventure', title_line2: 'Redefined', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1920&q=75', cta_label: 'Discover More', cta_href: '#vehicles' },
];

const FALLBACK_OFFERS: Offer[] = [
  { id: 1, title: 'BIG BUYS. BIG SAVINGS', caption: 'Check out our latest deals here!', image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=70' },
  { id: 2, title: 'NISSAN BUSINESS MOBILITY', caption: 'Let our vehicles bring you and your business to places.', image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=70' },
  { id: 3, title: 'NISSAN LEAF', caption: "The world's first mass-market EV.", image_url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=70' },
];

// Shown in the footer when the socials table is missing or empty, so the
// "Nissan Social" block always renders.
const FALLBACK_SOCIALS: Social[] = [
  { id: 1, platform: 'Facebook', url: 'https://facebook.com/nissancdo' },
  { id: 2, platform: 'Instagram', url: '#' },
  { id: 3, platform: 'YouTube', url: '#' },
];

export async function getSocials(): Promise<Social[]> {
  try {
    const rows = await query<Social>('SELECT id, platform, url FROM socials ORDER BY sort_order ASC, id ASC');
    return rows.length ? rows : FALLBACK_SOCIALS;
  } catch {
    return FALLBACK_SOCIALS;
  }
}

function normalizeVehicle(v: any): Vehicle {
  return {
    ...v,
    price_from: Number(v.price_from),
    brochure_url: v.brochure_url ?? '',
    show_in_menu: Number(v.show_in_menu),
    show_in_brochures: Number(v.show_in_brochures),
  };
}

// All vehicles, normalized. Runs the idempotent column migration first so the
// brochure_url / show_* columns exist on databases created before this feature.
async function fetchAllVehicles(): Promise<Vehicle[]> {
  await ensureEntity('vehicles');
  const rows = await query<any>(
    'SELECT id, name, category, tagline, price_from, image_url, brochure_url, show_in_menu, show_in_brochures FROM vehicles ORDER BY sort_order ASC, id ASC',
  );
  return rows.length ? rows.map(normalizeVehicle) : FALLBACK_VEHICLES;
}

// Shown on the homepage and the "Our Vehicles" menu/listing.
export async function getVehicles(): Promise<Vehicle[]> {
  try {
    return (await fetchAllVehicles()).filter((v) => v.show_in_menu);
  } catch {
    return FALLBACK_VEHICLES.filter((v) => v.show_in_menu);
  }
}

// Shown on the Download Brochure page.
export async function getBrochureVehicles(): Promise<Vehicle[]> {
  try {
    return (await fetchAllVehicles()).filter((v) => v.show_in_brochures);
  } catch {
    return FALLBACK_VEHICLES.filter((v) => v.show_in_brochures);
  }
}

export async function getSlides(): Promise<Slide[]> {
  try {
    const rows = await query<Slide>('SELECT id, kicker, title_line1, title_line2, image_url, cta_label, cta_href FROM slides ORDER BY sort_order ASC');
    return rows.length ? rows : FALLBACK_SLIDES;
  } catch {
    return FALLBACK_SLIDES;
  }
}

export async function getOffers(): Promise<Offer[]> {
  try {
    const rows = await query<Offer>('SELECT id, title, caption, image_url FROM offers ORDER BY id ASC');
    return rows.length ? rows : FALLBACK_OFFERS;
  } catch {
    return FALLBACK_OFFERS;
  }
}
