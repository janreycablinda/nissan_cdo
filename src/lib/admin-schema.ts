export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'image'
  | 'password'
  | 'toggle'
  | 'variants'
  | 'features'
  // Display-only timestamp owned by the database (e.g. created_at). Never
  // written back by the admin — createRow/updateRow skip it.
  | 'datetime';

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
  // Optional idempotent DDL run before any read/write so the table (and its
  // columns) exist even on databases created before this entity/field was
  // added (init.sql only runs on a fresh MySQL volume). May be a single
  // statement or a list; benign "already exists" errors are ignored.
  ensure?: string | string[];
  // Restrict this entity to admin-role users (hidden from editors, enforced
  // in middleware + the entity page).
  adminOnly?: boolean;
  // Optional ORDER BY clause (column refs already backtick-quoted) used by the
  // admin list view. Defaults to sort_order/id. e.g. '`id` DESC' for newest-first.
  defaultOrder?: string;
  // Opt this entity into read/unread tracking. Names a TINYINT(1) column
  // (0 = unread, 1 = read) the admin UI surfaces with bold rows, a mark
  // read/unread action, and an unread badge in the sidebar.
  readColumn?: string;
  // Hide the row "Duplicate" action (e.g. for submissions that shouldn't be copied).
  disableClone?: boolean;
  // Records can't be created or edited — the admin shows them in a read-only
  // view (no "Add New", no editable form). Used for submissions like inquiries.
  readOnly?: boolean;
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
      { name: 'brochure_url', label: 'Brochure Link', type: 'text', placeholder: 'https://… or /brochures/patrol.pdf' },
      { name: 'variants', label: 'Variants & Pricing', type: 'variants' },
      { name: 'show_in_menu', label: 'Show on Menu & Homepage', type: 'toggle' },
      { name: 'show_in_brochures', label: 'Show on Brochure Page', type: 'toggle' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },

      // --- Detail page (/vehicles/<slug>) --------------------------------
      // Every field below is optional: the page falls back to sensible copy
      // derived from the vehicle itself (see vehicle-content.ts), so a new
      // vehicle gets a complete page the moment it's added.
      { name: 'slug', label: 'Page URL Slug', type: 'text', required: true, placeholder: 'almera' },
      { name: 'show_page', label: 'Show Detail Page', type: 'toggle' },
      // Wide banner shot for the detail-page hero. Distinct from image_url,
      // which is the transparent cut-out used in the lineup grid. Falls back to
      // image_url when blank.
      { name: 'hero_image', label: 'Hero — Banner Image', type: 'image', placeholder: '/images/vehicles/hero/…' },
      { name: 'hero_kicker', label: 'Hero — Kicker', type: 'text', placeholder: 'Engineered for Excitement' },
      { name: 'hero_title', label: 'Hero — Title', type: 'text', placeholder: 'The Nissan Almera' },
      { name: 'hero_subtitle', label: 'Hero — Subtitle', type: 'text', placeholder: 'with NissanConnect | Services' },
      { name: 'intro_heading', label: 'Intro — Heading', type: 'text' },
      { name: 'intro_body', label: 'Intro — Body', type: 'textarea' },
      { name: 'features', label: 'Feature Sections', type: 'features' },
      { name: 'accessories_heading', label: 'Accessories — Heading', type: 'text' },
      { name: 'accessories_body', label: 'Accessories — Body', type: 'textarea' },
      { name: 'accessories_image', label: 'Accessories — Image', type: 'image' },
      { name: 'accessories_caption', label: 'Accessories — Caption', type: 'text' },
      { name: 'accessories_note', label: 'Accessories — Caption Note', type: 'textarea' },
      { name: 'warranty_years', label: 'Warranty — Years', type: 'number', placeholder: '5' },
      { name: 'warranty_heading', label: 'Warranty — Heading', type: 'text' },
      { name: 'warranty_body', label: 'Warranty — Body', type: 'textarea' },
      { name: 'warranty_note', label: 'Warranty — Fine Print', type: 'text' },
    ],
    ensure: [
      `ALTER TABLE vehicles ADD COLUMN brochure_url VARCHAR(255) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN show_in_menu TINYINT(1) NOT NULL DEFAULT 1`,
      `ALTER TABLE vehicles ADD COLUMN show_in_brochures TINYINT(1) NOT NULL DEFAULT 1`,
      `ALTER TABLE vehicles ADD COLUMN variants TEXT`,
      `ALTER TABLE vehicles ADD COLUMN slug VARCHAR(140) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN show_page TINYINT(1) NOT NULL DEFAULT 1`,
      `ALTER TABLE vehicles ADD COLUMN hero_image VARCHAR(255) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN hero_kicker VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN hero_title VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN hero_subtitle VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN intro_heading VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN intro_body TEXT`,
      `ALTER TABLE vehicles ADD COLUMN features TEXT`,
      `ALTER TABLE vehicles ADD COLUMN accessories_heading VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN accessories_body TEXT`,
      `ALTER TABLE vehicles ADD COLUMN accessories_image VARCHAR(255) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN accessories_caption VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN accessories_note TEXT`,
      `ALTER TABLE vehicles ADD COLUMN warranty_years INT NULL`,
      `ALTER TABLE vehicles ADD COLUMN warranty_heading VARCHAR(200) NOT NULL DEFAULT ''`,
      `ALTER TABLE vehicles ADD COLUMN warranty_body TEXT`,
      `ALTER TABLE vehicles ADD COLUMN warranty_note VARCHAR(200) NOT NULL DEFAULT ''`,
      // Backfill slugs for rows created before the column existed. Must run
      // BEFORE the unique index below, or the blank duplicates would collide.
      `UPDATE vehicles SET slug = TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-'))) WHERE slug = ''`,
      `ALTER TABLE vehicles ADD UNIQUE KEY uniq_vehicles_slug (slug)`,
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
  inquiries: {
    key: 'inquiries',
    label: 'Inquiries',
    table: 'inquiries',
    // Newest submissions first.
    defaultOrder: '`id` DESC',
    readColumn: 'is_read',
    readOnly: true,
    fields: [
      { name: 'salutation', label: 'Salutation', type: 'text' },
      { name: 'full_name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'phone', label: 'Mobile', type: 'text', required: true },
      { name: 'inquiry_type', label: 'Inquiry Type', type: 'text' },
      { name: 'vehicle', label: 'Vehicle', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'created_at', label: 'Date Sent', type: 'datetime' },
    ],
    ensure: [
      `CREATE TABLE IF NOT EXISTS inquiries (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        salutation    VARCHAR(20)  NOT NULL DEFAULT '',
        full_name     VARCHAR(160) NOT NULL,
        email         VARCHAR(160) NOT NULL,
        phone         VARCHAR(60)  NOT NULL,
        inquiry_type  VARCHAR(60)  NOT NULL DEFAULT '',
        vehicle       VARCHAR(120),
        message       TEXT,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `ALTER TABLE inquiries ADD COLUMN salutation VARCHAR(20) NOT NULL DEFAULT ''`,
      `ALTER TABLE inquiries ADD COLUMN inquiry_type VARCHAR(60) NOT NULL DEFAULT ''`,
      `ALTER TABLE inquiries ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0`,
      `ALTER TABLE inquiries ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    ],
  },
  // Where new inquiry notifications get emailed. A single-row entity: the app
  // always reads row id 1, so there's no "Add New" workflow to worry about.
  // SMTP credentials stay in .env — only the routing is editable here.
  email_settings: {
    key: 'email_settings',
    label: 'Email Notifications',
    table: 'email_settings',
    adminOnly: true,
    disableClone: true,
    fields: [
      { name: 'enabled', label: 'Forward Inquiries by Email', type: 'toggle' },
      {
        name: 'recipient',
        label: 'Send Inquiries To',
        type: 'text',
        required: true,
        placeholder: 'sales@nissancdo.com',
      },
      {
        name: 'cc',
        label: 'CC (optional, comma-separated)',
        type: 'text',
        placeholder: 'manager@nissancdo.com, service@nissancdo.com',
      },
      {
        name: 'subject_prefix',
        label: 'Subject Prefix',
        type: 'text',
        placeholder: '[Nissan CDO]',
      },
    ],
    ensure: [
      `CREATE TABLE IF NOT EXISTS email_settings (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        enabled        TINYINT(1)   NOT NULL DEFAULT 1,
        recipient      VARCHAR(255) NOT NULL DEFAULT '',
        cc             VARCHAR(255) NOT NULL DEFAULT '',
        subject_prefix VARCHAR(80)  NOT NULL DEFAULT '[Nissan CDO]',
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      // Seed the single settings row so the admin form always has one to edit.
      `INSERT INTO email_settings (id, enabled, recipient, subject_prefix)
         SELECT 1, 1, '', '[Nissan CDO]'
         WHERE NOT EXISTS (SELECT 1 FROM email_settings WHERE id = 1)`,
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
