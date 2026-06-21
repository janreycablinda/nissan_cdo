-- Nissan Cagayan de Oro — database schema & seed data
-- Auto-loaded by the MySQL container on first start.

CREATE TABLE IF NOT EXISTS vehicles (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(120) NOT NULL,
  category          VARCHAR(60)  NOT NULL,
  tagline           VARCHAR(255) NOT NULL,
  price_from        DECIMAL(12,2) NOT NULL,
  image_url         VARCHAR(255) NOT NULL,
  brochure_url      VARCHAR(255) NOT NULL DEFAULT '',
  variants          TEXT,
  show_in_menu      TINYINT(1) NOT NULL DEFAULT 1,
  show_in_brochures TINYINT(1) NOT NULL DEFAULT 1,
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slides (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  kicker        VARCHAR(160),
  title_line1   VARCHAR(120) NOT NULL,
  title_line2   VARCHAR(120),
  image_url     VARCHAR(255) NOT NULL,
  cta_label     VARCHAR(80)  NOT NULL DEFAULT 'Discover More',
  cta_href      VARCHAR(160) NOT NULL DEFAULT '#vehicles',
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(160) NOT NULL,
  caption       VARCHAR(255) NOT NULL,
  image_url     VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  address       VARCHAR(255) NOT NULL,
  phone         VARCHAR(60)  NOT NULL,
  hours         VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS socials (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  platform      VARCHAR(60)  NOT NULL,
  url           VARCHAR(255) NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(120) NOT NULL UNIQUE,
  name          VARCHAR(160) NOT NULL DEFAULT '',
  role          VARCHAR(20)  NOT NULL DEFAULT 'editor',
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  salutation    VARCHAR(20)  NOT NULL DEFAULT '',
  full_name     VARCHAR(160) NOT NULL,
  email         VARCHAR(160) NOT NULL,
  phone         VARCHAR(60)  NOT NULL,
  inquiry_type  VARCHAR(60)  NOT NULL DEFAULT '',
  vehicle       VARCHAR(120),
  message       TEXT,
  is_read       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vehicles (name, category, tagline, price_from, image_url, brochure_url, variants, sort_order) VALUES
  ('Kicks e-POWER', 'SUVs',          'Electric drive. No charging needed.', 1179000.00, '/images/vehicles/Kicks.png',  'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures/kicks_brochure.pdf',  '[{"name":"EL","price":1179000},{"name":"VE","price":1329000},{"name":"VL","price":1479000}]', 1),
  ('Urvan',         'Vans & Trucks', 'Move more. Do more.',                 1280000.00, '/images/vehicles/URVAN.jpg',  '',                                                                                    '[{"name":"Standard 15-Seater","price":1280000},{"name":"Premium","price":1650000},{"name":"Premium S","price":2165000}]', 2),
  ('Patrol',        'SUVs',          'The ultimate flagship SUV.',          5335000.00, '/images/vehicles/PATROL.jpg', 'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures/patrol_brochure.pdf', '[{"name":"Royale","price":5335000},{"name":"Premium","price":5385000}]', 3),
  ('Almera',        'Cars',          'Bold, efficient, and turbocharged.',   845000.00, '/images/vehicles/almera.png', 'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures/almera_brochure.pdf', '[{"name":"MT","price":845000},{"name":"VE CVT","price":1045000},{"name":"VL Turbo CVT","price":1199000}]', 4),
  ('Terra',         'SUVs',          'Adventure, redefined.',               1969000.00, '/images/vehicles/Terra.jpg',  'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures/terra_brochure.pdf',  '[{"name":"EL 4x2 AT","price":1969000},{"name":"VE 4x2 AT","price":2189000},{"name":"VL 4x4 AT","price":2469000}]', 5),
  ('Navara',        'Vans & Trucks', 'Built to dominate every terrain.',    1240000.00, '/images/vehicles/Navara.png', 'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures/navara_brochure.pdf', '[{"name":"Calibre 4x2 MT","price":1240000},{"name":"VE 4x2 AT","price":1560000},{"name":"VL 4x4 AT","price":2220000}]', 6),
  ('Livina',        'Cars',          'Seven seats. Endless possibilities.', 1094000.00, '/images/vehicles/Livina.png', 'https://www-asia.nissan-cdn.net/content/dam/Nissan/ph/brochures/livina_brochure.pdf', '[{"name":"E MT","price":1094000},{"name":"VE CVT","price":1199000},{"name":"VL CVT","price":1274000}]', 7);

INSERT INTO slides (kicker, title_line1, title_line2, image_url, cta_label, cta_href, sort_order) VALUES
  ('The All-New Nissan Patrol', 'Dare to Be', 'Exceptional', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1920&q=75', 'Discover More', '#vehicles', 1),
  ('The Nissan Navara',         'Built to',   'Dominate',    'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1920&q=75', 'Discover More', '#vehicles', 2),
  ('The Nissan Terra',          'Adventure',  'Redefined',   'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1920&q=75', 'Discover More', '#vehicles', 3);

INSERT INTO offers (title, caption, image_url) VALUES
  ('BIG BUYS. BIG SAVINGS',     'Check out our latest deals here!',                          'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=70'),
  ('NISSAN BUSINESS MOBILITY',  'Let our vehicles bring you and your business to places.',   'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=70'),
  ('NISSAN LEAF',               'The world''s first mass-market EV.',                        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=70');

INSERT INTO branches (name, address, phone, hours) VALUES
  ('Nissan Cagayan de Oro', 'Zone 7, Kauswagan National Highway, Cagayan de Oro City, Misamis Oriental', '0917-774-4602', 'Mon–Sat 8:00 AM – 6:00 PM');

INSERT INTO socials (platform, url, sort_order) VALUES
  ('Facebook',  'https://facebook.com/nissancdo', 1),
  ('Instagram', '#',                              2),
  ('YouTube',   '#',                              3);
