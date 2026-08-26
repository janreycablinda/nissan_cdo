// Detail-page content helpers for /vehicles/<slug>.
//
// Kept free of server-only imports (no mysql2) so client components can use
// slugify/vehicleHref without pulling the DB layer into the browser bundle.
//
// Every field on the vehicles table that backs the detail page is optional. The
// resolvers below fall back to shared marketing copy parameterised by the
// vehicle's own name, so a newly added vehicle renders a complete page before
// anyone has written a word for it in /admin.

export type VehicleFeature = {
  label: string;
  title: string;
  body: string;
  image: string;
};

/** Turn a vehicle name into a URL slug. Mirrors the SQL backfill in admin-schema.ts. */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Parse the `features` JSON column into rows, tolerating null/garbage. */
export function parseFeatures(raw: unknown): VehicleFeature[] {
  if (Array.isArray(raw)) return raw as VehicleFeature[];
  try {
    const arr = JSON.parse(typeof raw === 'string' && raw ? raw : '[]');
    if (!Array.isArray(arr)) return [];
    return arr
      .map((f) => ({
        label: String(f?.label ?? '').trim(),
        title: String(f?.title ?? '').trim(),
        body: String(f?.body ?? '').trim(),
        image: String(f?.image ?? '').trim(),
      }))
      .filter((f) => f.label !== '');
  } catch {
    return [];
  }
}

const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1280&q=70',
  'https://images.unsplash.com/photo-1552960562-daf630e9278b?auto=format&fit=crop&w=1280&q=70',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1280&q=70',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1280&q=70',
  'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1280&q=70',
];

// Shared fallback sections — the copy that used to be hardcoded in the Almera
// page. `{name}` is replaced with the vehicle's name at render time.
const DEFAULT_FEATURES: VehicleFeature[] = [
  {
    label: 'NissanConnect Services',
    title: 'Exciting Mobility\nThrough Connectivity',
    body: 'Stay connected to your {name} like never before with NissanConnect Services. Control many of your vehicle’s features with just a tap, receive maintenance alerts, and get immediate assistance in case of an emergency.',
    image: STOCK_IMAGES[0],
  },
  {
    label: 'Nissan Intelligent Mobility',
    title: 'Innovative Technology',
    body: 'Nissan Intelligent Mobility includes a suite of innovative features that give you a more confident drive and help you maneuver with greater safety.',
    image: STOCK_IMAGES[1],
  },
  {
    label: 'Performance',
    title: 'Engineered\nPerformance',
    body: 'The Nissan {name}’s powerful engine lets you enjoy thrilling performance without sacrificing fuel efficiency.',
    image: STOCK_IMAGES[2],
  },
  {
    label: 'Design',
    title: 'Generosity Beyond\nSpace',
    body: 'From a sleek dashboard design to a refined interior with quilted stitching, plus comfortable amenities, you’ll find the {name} comfortable on every journey.',
    image: STOCK_IMAGES[3],
  },
  {
    label: 'Features',
    title: 'Have a Safer and More\nConfident Drive',
    body: 'You’re bound to keep all eyes on the road. But with class-leading safety technology, you and your passengers are kept secure on every journey.',
    image: STOCK_IMAGES[4],
  },
];

/** Shape the detail page renders. Every value is resolved — never blank. */
export type VehiclePageContent = {
  heroImage: string;
  // 'cover' for a dedicated wide banner, 'contain' for the lineup cut-out
  // fallback — a transparent PNG would be cropped badly by cover.
  heroFit: 'cover' | 'contain';
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  introHeading: string;
  introBody: string;
  features: VehicleFeature[];
  accessoriesHeading: string;
  accessoriesBody: string;
  accessoriesImage: string;
  accessoriesCaption: string;
  accessoriesNote: string;
  warrantyYears: number;
  warrantyHeading: string;
  warrantyBody: string;
  warrantyNote: string;
};

// Source row: the vehicles table, whose detail columns may be missing entirely
// on an older database (the admin's `ensure` DDL adds them lazily).
type ContentSource = Record<string, unknown> & { name: string };

const str = (v: unknown) => String(v ?? '').trim();
/** Use the admin-provided value when it's non-blank, otherwise the fallback. */
const pick = (v: unknown, fallback: string) => str(v) || fallback;
const fill = (tpl: string, name: string) => tpl.replace(/\{name\}/g, name);

export function resolveContent(v: ContentSource): VehiclePageContent {
  const name = str(v.name);
  const authored = parseFeatures(v.features);
  const features = (authored.length ? authored : DEFAULT_FEATURES).map((f) => ({
    ...f,
    title: fill(f.title, name),
    body: fill(f.body, name),
  }));

  const heroImage = str(v.hero_image);

  return {
    heroImage: heroImage || str(v.image_url),
    heroFit: heroImage ? 'cover' : 'contain',
    heroKicker: pick(v.hero_kicker, 'Engineered for Excitement'),
    heroTitle: pick(v.hero_title, `The Nissan ${name}`),
    heroSubtitle: str(v.hero_subtitle),
    introHeading: pick(v.intro_heading, 'Engineered for Excitement'),
    introBody: pick(
      v.intro_body,
      `The all-new ${name} embodies excitement inside and out, with an array of Nissan Intelligent Mobility features that let you stay connected wherever, whenever.`,
    ),
    features,
    accessoriesHeading: pick(v.accessories_heading, 'Nissan Genuine Accessories'),
    accessoriesBody: pick(
      v.accessories_body,
      `Care to break away from the norm with the style that matches your ${name}’s modern and top-grade features. Enhance your vehicle and explore your preference with Nissan Genuine Accessories.`,
    ),
    accessoriesImage: pick(
      v.accessories_image,
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=70',
    ),
    accessoriesCaption: pick(v.accessories_caption, 'Side Door Visor'),
    accessoriesNote: pick(
      v.accessories_note,
      'Cuts air to stay out of the way while keeping the rain and dirt off your windows when slightly open.',
    ),
    warrantyYears: Number(v.warranty_years) > 0 ? Number(v.warranty_years) : 5,
    warrantyHeading: pick(v.warranty_heading, '5-Year Warranty or 150,000km Warranty'),
    warrantyBody: pick(
      v.warranty_body,
      `Be protected from unexpected repair costs with the Nissan ${name}’s 5-Year or 150,000km warranty.`,
    ),
    warrantyNote: str(v.warranty_note),
  };
}
