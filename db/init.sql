-- Nissan Cagayan de Oro — database schema & seed data
-- Auto-loaded by the MySQL container on first start.

CREATE TABLE IF NOT EXISTS vehicles (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  category      VARCHAR(60)  NOT NULL,
  tagline       VARCHAR(255) NOT NULL,
  price_from    DECIMAL(12,2) NOT NULL,
  image_url     VARCHAR(255) NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  full_name     VARCHAR(160) NOT NULL,
  email         VARCHAR(160) NOT NULL,
  phone         VARCHAR(60)  NOT NULL,
  vehicle       VARCHAR(120),
  message       TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vehicles (name, category, tagline, price_from, image_url, sort_order) VALUES
  ('Kicks e-POWER', 'SUVs',          'Electric drive. No charging needed.', 1209000.00, '/images/vehicles/Kicks.png',  1),
  ('Urvan',         'Vans & Trucks', 'Move more. Do more.',                 1850000.00, '/images/vehicles/URVAN.jpg',  2),
  ('Patrol',        'SUVs',          'The ultimate flagship SUV.',          4900000.00, '/images/vehicles/PATROL.jpg', 3),
  ('Almera',        'Cars',          'Bold, efficient, and turbocharged.',   768000.00, '/images/vehicles/almera.png', 4),
  ('Terra',         'SUVs',          'Adventure, redefined.',               1779000.00, '/images/vehicles/Terra.jpg',  5),
  ('Navara',        'Vans & Trucks', 'Built to dominate every terrain.',    1199000.00, '/images/vehicles/Navara.png', 6),
  ('Livina',        'Cars',          'Seven seats. Endless possibilities.', 1029000.00, '/images/vehicles/Livina.png', 7);

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
