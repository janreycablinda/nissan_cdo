# Nissan Cagayan de Oro — Homepage Clone

A demo dealership homepage built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, backed by **MySQL** and managed with **phpMyAdmin**, fully containerized with **Docker Compose**.

> This is an independent clone for development/learning purposes. It uses placeholder
> imagery and is not affiliated with or endorsed by Nissan Motor Co.

## Stack

| Layer        | Tech                                  |
| ------------ | ------------------------------------- |
| Frontend/SSR | Next.js 14, React 18, Tailwind CSS    |
| Database     | MySQL 8                               |
| DB Admin     | phpMyAdmin                            |
| Container    | Docker Compose                        |

## Features

- Responsive Nissan-styled homepage (header, hero, vehicle lineup, promos, about, branches, contact).
- Vehicles / promos / branches loaded **from MySQL** at request time (with a static fallback if the DB is unreachable).
- Working **contact/inquiry form** that writes submissions into the `inquiries` table via an API route.
- phpMyAdmin UI to browse the data.

## Quick start (Docker — everything)

```bash
docker compose up --build
```

Then open:

| Service       | URL                          | Credentials              |
| ------------- | ---------------------------- | ------------------------ |
| Website       | http://localhost:3000        | —                        |
| phpMyAdmin    | http://localhost:8080        | user `nissan` / `nissanpass` (or root / `rootpass`) |
| MySQL         | localhost:3306               | db `nissan`              |

The database schema and seed data load automatically from [`db/init.sql`](db/init.sql)
on first startup.

## Local development (app on host, DB in Docker)

```bash
# 1. Start only the database + phpMyAdmin
docker compose up -d db phpmyadmin

# 2. Install deps and run the dev server
npm install
npm run dev
```

The app reads DB settings from `.env.local` (already pointed at `127.0.0.1:3306`).
Open http://localhost:3000.

## Project structure

```
.
├── docker-compose.yml      # web + db + phpmyadmin
├── Dockerfile              # multi-stage Next.js standalone build
├── db/init.sql             # schema + seed data
└── src/
    ├── app/
    │   ├── page.tsx        # homepage (server component, queries MySQL)
    │   ├── layout.tsx
    │   ├── globals.css
    │   └── api/
    │       ├── inquiries/route.ts   # POST — saves contact form
    │       └── vehicles/route.ts    # GET  — lists vehicles
    ├── components/         # Header, Hero, VehicleLineup, Promos, About, Branches, ContactForm, Footer
    └── lib/
        ├── db.ts           # mysql2 connection pool
        └── data.ts         # data access + fallback data
```

## Viewing form submissions

After submitting the contact form, open phpMyAdmin → `nissan` → `inquiries` to see
the stored records.

## Resetting the database

```bash
docker compose down -v   # removes the db_data volume, re-seeds on next up
```
