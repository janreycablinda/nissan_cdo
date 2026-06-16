import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Nissan Almera | Nissan Cagayan de Oro',
  description:
    'Discover the Nissan Almera — turbocharged performance, NissanConnect Services, and Nissan Intelligent Mobility in a refined, spacious sedan.',
};

// Local image is /images/vehicles/almera.png. The section visuals below use
// Unsplash placeholders (same convention as the homepage components) — swap
// these for the official Almera assets when available.
const FEATURES: {
  label: string;
  title: string[];
  body: string;
  image: string;
}[] = [
  {
    label: 'NissanConnect Services',
    title: ['Exciting Mobility', 'Through Connectivity'],
    body: 'Stay connected to your Almera like never before with NissanConnect Services — a first in the subcompact sedan category. Control many of your vehicle’s features with just a tap, receive maintenance alerts, and get immediate assistance in case of an emergency.',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1280&q=70',
  },
  {
    label: 'Nissan Intelligent Mobility',
    title: ['Innovative Technology'],
    body: 'Nissan Intelligent Mobility includes a suite of innovative features that give you a more confident drive and help you maneuver with greater safety.',
    image:
      'https://images.unsplash.com/photo-1552960562-daf630e9278b?auto=format&fit=crop&w=1280&q=70',
  },
  {
    label: 'Performance',
    title: ['Turbocharged', 'Performance'],
    body: 'The Nissan Almera’s powerful 1.0L-litre turbocharged engine lets you enjoy thrilling performance without sacrificing fuel efficiency.',
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1280&q=70',
  },
  {
    label: 'Design',
    title: ['Generosity Beyond', 'Space'],
    body: 'From a sleek dashboard design to a black leather interior with quilted stitching, plus comfortable amenities, you’ll find the Almera comfortable on every journey, with comfort and control at an upgrade.',
    image:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1280&q=70',
  },
  {
    label: 'Features',
    title: ['Have a Safer and More', 'Confident Drive'],
    body: 'You’re bound to keep all eyes on the road. But with class-leading and engineered-with-class-leading safety technology, you and your passengers are kept secure on every journey.',
    image:
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1280&q=70',
  },
];

const ACTIONS = [
  { label: 'Download a Brochure', href: '/#offers' },
  { label: 'Book a Test Drive', href: '/#offers' },
  { label: 'Request a Quote', href: '/#offers' },
  { label: 'Visit Price Guide Page', href: '/#offers' },
];

export default function AlmeraPage() {
  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="relative h-[78vh] min-h-[460px] w-full overflow-hidden bg-nissan-dark">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('/images/vehicles/almera.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="container-x relative flex h-full flex-col justify-end pb-16 text-white">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-300">
            Engineered for Excitement
          </p>
          <h1 className="text-4xl font-light uppercase leading-[1.05] tracking-wide sm:text-6xl">
            The Nissan Almera
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-200">
            with Nissan<span className="font-semibold text-nissan-red">Connect</span> | Services
          </p>
        </div>
      </section>

      {/* Intro band */}
      <section className="bg-nissan-dark py-16 text-white">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="relative inline-block pb-3 text-2xl font-light uppercase tracking-wide sm:text-[28px]">
              Engineered for Excitement
              <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-nissan-red" />
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            The all-new Almera embodies excitement inside and out with its sleek front and rear
            fascia, array of Nissan Intelligent Mobility features, and the latest innovation,
            NissanConnect Services, that lets you stay connected to your Almera wherever, whenever.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      {FEATURES.map((f) => (
        <section
          key={f.label}
          className="relative flex min-h-[460px] items-center overflow-hidden bg-nissan-dark py-16 text-white"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-55"
            style={{ backgroundImage: `url('${f.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

          {/* Vertical side label */}
          <span className="absolute left-0 top-0 flex h-full w-8 items-center justify-center bg-nissan-red/90 text-[10px] font-semibold uppercase tracking-[0.25em] text-white [writing-mode:vertical-rl] sm:w-10">
            {f.label}
          </span>

          <div className="container-x relative">
            <div className="max-w-xl pl-10 sm:pl-12">
              <h2 className="text-3xl font-light uppercase leading-tight tracking-wide sm:text-4xl">
                {f.title.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-200">{f.body}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/#offers" className="btn-outline">
                  Read More
                </a>
                <a href="/#offers" className="btn-outline">
                  Book a Test Drive
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Genuine Accessories */}
      <section className="bg-white py-16">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading>Nissan Genuine Accessories</SectionHeading>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-nissan-gray">
              Care to break away from the norm with the style that matches your Almera’s
              modern and top-grade features. Enhance your vehicle and explore your
              preference with Nissan Genuine Accessories.
            </p>
            <a href="/#offers" className="btn-primary mt-7">
              Read More
            </a>
          </div>
          <div>
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=70')",
                }}
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-nissan-dark">
              Side Door Visor
            </p>
            <p className="mt-1 text-xs text-nissan-gray">
              Cuts air to stay out of the way while keeping the rain and dirt off your windows
              when slightly open.
            </p>
          </div>
        </div>
      </section>

      {/* Warranty */}
      <section className="bg-nissan-light py-16">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nissan-gray">
              Warranty
            </p>
            <h2 className="mt-3 text-2xl font-light uppercase tracking-wide text-nissan-dark sm:text-3xl">
              5-Year Warranty or 150,000km Warranty
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-nissan-gray">
              Be protected from unexpected repair costs with the Nissan Almera’s 5-Year or
              150,000km warranty.
            </p>
            <a href="/#offers" className="btn-primary mt-7">
              Read More
            </a>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="text-nissan-dark">
              <span className="text-7xl font-extrabold leading-none tracking-tighter sm:text-8xl">
                5
              </span>
              <span className="ml-1 align-top text-4xl font-extrabold uppercase sm:text-5xl">
                Year
              </span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-nissan-red">
                Nissan Warranty
              </p>
              <p className="text-[11px] uppercase tracking-wide text-nissan-gray">
                For VL variant only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What would you like to do? */}
      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="text-center text-2xl font-light uppercase tracking-wide text-nissan-dark sm:text-[28px]">
            What Would You Like to Do?
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {ACTIONS.map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="group flex flex-col items-center text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gray-300 text-nissan-red transition group-hover:border-nissan-red">
                  ›
                </span>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-nissan-dark transition group-hover:text-nissan-red">
                  {a.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
