export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'image' | 'password';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type EntityConfig = {
  key: string;
  label: string;
  table: string;
  fields: Field[];
  // Optional idempotent DDL run before any read/write so the table exists
  // even on databases created before this entity was added (init.sql only
  // runs on a fresh MySQL volume).
  ensure?: string;
  // Restrict this entity to admin-role users (hidden from editors, enforced
  // in middleware + the entity page).
  adminOnly?: boolean;
};

export const USER_ROLES = ['admin', 'editor'] as const;

export const USERS_TABLE = 'admin_users';

export const ENSURE_USERS_TABLE = `CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(120) NOT NULL UNIQUE,
  name          VARCHAR(160) NOT NULL DEFAULT '',
  role          VARCHAR(20)  NOT NULL DEFAULT 'editor',
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Social platforms shown in the footer. The option values double as the keys
// for the icon lookup in the Footer component — keep them in sync.
export const SOCIAL_PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'X', 'LinkedIn'] as const;

export const ENTITIES: Record<string, EntityConfig> = {
  slides: {
    key: 'slides',
    label: 'Hero Slides',
    table: 'slides',
    fields: [
      { name: 'kicker', label: 'Kicker', type: 'text', placeholder: 'The All-New Nissan Patrol' },
      { name: 'title_line1', label: 'Title Line 1', type: 'text', required: true, placeholder: 'Dare to Be' },
      { name: 'title_line2', label: 'Title Line 2', type: 'text', placeholder: 'Exceptional' },
      { name: 'image_url', label: 'Background Image URL', type: 'image', required: true, placeholder: 'https://… or /images/…' },
      { name: 'cta_label', label: 'Button Label', type: 'text', placeholder: 'Discover More' },
      { name: 'cta_href', label: 'Button Link', type: 'text', placeholder: '#vehicles' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
  },
  vehicles: {
    key: 'vehicles',
    label: 'Vehicles',
    table: 'vehicles',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Patrol' },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Cars', 'Vans & Trucks', 'SUVs'] },
      { name: 'tagline', label: 'Tagline', type: 'text', required: true },
      { name: 'price_from', label: 'Price From (₱)', type: 'number', required: true },
      { name: 'image_url', label: 'Image URL', type: 'image', required: true, placeholder: '/images/vehicles/…' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
  },
  offers: {
    key: 'offers',
    label: 'Special Offers',
    table: 'offers',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'caption', label: 'Caption', type: 'textarea', required: true },
      { name: 'image_url', label: 'Image URL', type: 'image', required: true },
    ],
  },
  socials: {
    key: 'socials',
    label: 'Social Media',
    table: 'socials',
    fields: [
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: [...SOCIAL_PLATFORMS] },
      { name: 'url', label: 'Profile URL', type: 'text', required: true, placeholder: 'https://facebook.com/nissancdo' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    ensure: `CREATE TABLE IF NOT EXISTS socials (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      platform    VARCHAR(60)  NOT NULL,
      url         VARCHAR(255) NOT NULL,
      sort_order  INT NOT NULL DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  },
  users: {
    key: 'users',
    label: 'Admin Users',
    table: USERS_TABLE,
    adminOnly: true,
    fields: [
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'jdelacruz' },
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Juan dela Cruz' },
      { name: 'role', label: 'Role', type: 'select', required: true, options: [...USER_ROLES] },
      { name: 'password_hash', label: 'Password', type: 'password', required: true },
    ],
    ensure: ENSURE_USERS_TABLE,
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES);

// Entity keys restricted to admin-role users — used to hide nav links and to
// gate routes in middleware.
export const ADMIN_ONLY_ENTITY_KEYS = Object.values(ENTITIES)
  .filter((e) => e.adminOnly)
  .map((e) => e.key);
