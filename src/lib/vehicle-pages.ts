// Client-safe mapping of vehicles to their dedicated detail pages.
// Kept separate from data.ts so client components can import vehicleHref
// without pulling in server-only DB code (mysql2).

// Vehicles that have a dedicated detail page, keyed by lowercased name.
// Add an entry here when a new vehicle page is created under /vehicles/<slug>.
const VEHICLE_PAGES: Record<string, string> = {
  almera: '/vehicles/almera',
};

// Returns the detail-page path for a vehicle if one exists, otherwise null.
export function vehicleHref(vehicle: { name: string }): string | null {
  return VEHICLE_PAGES[vehicle.name.trim().toLowerCase()] ?? null;
}
