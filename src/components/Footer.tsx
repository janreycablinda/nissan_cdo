import { getSocials } from '@/lib/data';

// Platform → icon. Keys must match the platform values stored by the admin
// (see SOCIAL_PLATFORMS in admin-schema). Unknown platforms use GENERIC_ICON.
const ICONS: Record<string, JSX.Element> = {
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.5 21v-8h2.4l.4-2.9h-2.8V8.3c0-.8.2-1.4 1.4-1.4h1.5V4.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.3V13h2.6v8h2.6z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23 12s0-3.1-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C19.4 5.3 12 5.3 12 5.3s-7.4 0-8.9.4c-.8.2-1.5.9-1.7 1.7C1 8.9 1 12 1 12s0 3.1.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.5.4-4.6.4-4.6zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 4c-2.2 0-2.5 0-3.3.1-.9 0-1.4.2-1.8.3-.4.2-.8.4-1.1.7-.3.3-.5.7-.7 1.1-.1.4-.3.9-.3 1.8C4.8 8.8 4.8 9 4.8 11.2v1.6c0 2.2 0 2.5.1 3.3 0 .9.2 1.4.3 1.8.2.4.4.8.7 1.1.3.3.7.5 1.1.7.4.1.9.3 1.8.3.8.1 1.1.1 3.3.1s2.5 0 3.3-.1c.9 0 1.4-.2 1.8-.3.4-.2.8-.4 1.1-.7.3-.3.5-.7.7-1.1.1-.4.3-.9.3-1.8.1-.8.1-1.1.1-3.3v-1.6c0-2.2 0-2.5-.1-3.3 0-.9-.2-1.4-.3-1.8-.2-.4-.4-.8-.7-1.1-.3-.3-.7-.5-1.1-.7-.4-.1-.9-.3-1.8-.3C14.5 4 14.2 4 12 4zm0 1.6c2.1 0 2.4 0 3.2.1.8 0 1.2.2 1.5.3.4.1.6.3.9.6.3.3.4.5.6.9.1.3.2.7.3 1.5 0 .8.1 1.1.1 3.2s0 2.4-.1 3.2c0 .8-.2 1.2-.3 1.5-.1.4-.3.6-.6.9-.3.3-.5.4-.9.6-.3.1-.7.2-1.5.3-.8 0-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.2-.2-1.5-.3-.4-.1-.6-.3-.9-.6-.3-.3-.4-.5-.6-.9-.1-.3-.2-.7-.3-1.5 0-.8-.1-1.1-.1-3.2s0-2.4.1-3.2c0-.8.2-1.2.3-1.5.1-.4.3-.6.6-.9.3-.3.5-.4.9-.6.3-.1.7-.2 1.5-.3.8 0 1.1-.1 3.2-.1zm0 2.7a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm0 6.1a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8zm4.7-6.3a.9.9 0 1 1-1.7 0 .9.9 0 0 1 1.7 0z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16.5 3c.3 2 1.4 3.5 3.5 3.8v2.4c-1.2.1-2.4-.3-3.5-.9v5.9c0 3.2-2.3 5.8-5.5 5.8a5.5 5.5 0 0 1 0-11c.3 0 .6 0 .9.1v2.6c-.3-.1-.6-.2-.9-.2a2.9 2.9 0 1 0 2.9 2.9V3h2.1z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.5 3h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.7-5 5.7H3.6l6.5-7.4L3 3h5.7l4 5.3L17.5 3zm-1 14.8h1.5L8 4.6H6.4l10.1 13.2z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M6.5 8.5v10h-3v-10h3zm.2-3a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0zM20.5 18.5h-3v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.4h-3v-10h2.9v1.4h.04c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7v5.5z" />
    </svg>
  ),
};

const GENERIC_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 16 0 18M12 3c-2.5 2.5-2.5 16 0 18" />
  </svg>
);

export default async function Footer() {
  const socials = await getSocials();

  return (
    <footer className="border-t border-gray-200 bg-white pb-8 pt-12 text-nissan-gray">
      <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-nissan-dark">
            Customer Service
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#vehicles" className="text-nissan-red hover:underline">Contact Us</a></li>
            <li className="pt-1">24/7 Customer Assistance Center:</li>
            <li className="font-semibold text-nissan-dark">
              <a href="tel:+0284036595" className="hover:text-nissan-red">(+02) 8403-6595</a>,{' '}
              <a href="tel:09276009557" className="hover:text-nissan-red">0927-600-9557</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-nissan-dark">
            Resources
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#offers" className="text-nissan-red hover:underline">Download Brochure</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-nissan-dark">
            Shopping Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li>Parts and accessories:</li>
            <li className="font-semibold text-nissan-dark">
              <a href="tel:0888584450" className="hover:text-nissan-red">088-858-4450</a>,{' '}
              <a href="tel:09173115248" className="hover:text-nissan-red">0917-311-5248</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-nissan-dark">
            Nissan Social
          </h4>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url || '#'}
                aria-label={s.platform}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-gray-200 text-nissan-dark transition hover:bg-nissan-red hover:text-white"
              >
                {ICONS[s.platform] ?? GENERIC_ICON}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x mt-12 border-t border-gray-100 pt-6 text-[11px]">
        © {new Date().getFullYear()} Nissan Cagayan de Oro · Demo clone for development
        purposes, not affiliated with Nissan Motor Co.
      </div>
    </footer>
  );
}
