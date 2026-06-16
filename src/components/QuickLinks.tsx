const TILES = [
  { label: 'Download a Brochure', href: '#offers', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=70' },
  { label: 'Book a Test Drive', href: '#vehicles', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=70' },
  { label: 'Virtual Showroom', href: '#vehicles', image: 'https://images.unsplash.com/photo-1552960562-daf630e9278b?auto=format&fit=crop&w=600&q=70' },
  { label: 'Contact Nissan', href: '#vehicles', image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=600&q=70' },
];

export default function QuickLinks() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4">
      {TILES.map((t) => (
        <a
          key={t.label}
          href={t.href}
          className="group relative flex h-44 items-center justify-center overflow-hidden bg-nissan-dark"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-60"
            style={{ backgroundImage: `url('${t.image}')` }}
          />
          <span className="relative z-10 px-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white">
            {t.label}
          </span>
        </a>
      ))}
    </section>
  );
}
