// Client-safe mapping of vehicles to their dedicated detail pages.
// Kept separate from data.ts so client components can import vehicleHref
// without pulling in server-only DB code (mysql2).

import { slugify } from './vehicle-content';

type Linkable = { name: string; slug?: string; show_page?: number };

// Every vehicle gets a page at /vehicles/<slug>. Editors can unpublish one by
// switching off "Show Detail Page" in /admin, which nulls the link here too.
export function vehicleHref(vehicle: Linkable): string | null {
  if (vehicle.show_page != null && !Number(vehicle.show_page)) return null;
  const slug = (vehicle.slug || '').trim() || slugify(vehicle.name);
  return slug ? `/vehicles/${slug}` : null;
}
