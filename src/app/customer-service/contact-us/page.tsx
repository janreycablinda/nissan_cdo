import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getVehicles } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us | Nissan Cagayan de Oro',
  description:
    'Get in touch with Nissan Cagayan de Oro. Send us your inquiry on vehicles, service, parts and more — our team is ready to help.',
};

const CONTACT = [
  {
    label: 'Showroom',
    lines: ['Zone 7, Kauswagan National Highway,', 'Cagayan de Oro City, Misamis Oriental'],
  },
  {
    label: 'Sales',
    lines: [{ text: '0917-774-4602', href: 'tel:09177744602' }],
  },
  {
    label: 'Service',
    lines: [{ text: '0917-621-8445', href: 'tel:09176218445' }],
  },
  {
    label: 'Parts & Accessories',
    lines: [
      { text: '088-858-4450', href: 'tel:0888584450' },
      { text: '0917-311-5248', href: 'tel:09173115248' },
    ],
  },
  {
    label: '24/7 Customer Assistance',
    lines: [
      { text: '(+02) 8403-6595', href: 'tel:+0284036595' },
      { text: '0927-600-9557', href: 'tel:09276009557' },
    ],
  },
  {
    label: 'Email',
    lines: [{ text: 'customersupport@nissan.ph', href: 'mailto:customersupport@nissan.ph' }],
  },
  {
    label: 'Showroom Hours',
    lines: ['Mon–Sat · 8:00 AM – 6:00 PM'],
  },
];

type Line = string | { text: string; href: string };

export default async function ContactUsPage() {
  const vehicles = await getVehicles();
  const vehicleNames = vehicles.map((v) => v.name);

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="bg-nissan-dark py-16 text-white">
        <div className="container-x">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nissan-red">
            Customer Service
          </p>
          <h1 className="mt-2 text-4xl font-light uppercase tracking-wide sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-300">
            Have a question about a vehicle, a test drive, service or parts? Send us a message and
            our team at Nissan Cagayan de Oro will get back to you.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-14">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div>
            <h2 className="relative inline-block pb-3 text-2xl font-light uppercase tracking-wide text-nissan-dark">
              Send Us a Message
              <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-nissan-red" />
            </h2>
            <p className="mb-8 mt-4 text-sm text-nissan-gray">
              Fields marked with <span className="text-nissan-red">*</span> are required.
            </p>
            <ContactForm vehicles={vehicleNames} />
          </div>

          {/* Contact details */}
          <aside className="bg-nissan-light p-7">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-nissan-dark">
              Get in Touch
            </h2>
            <dl className="mt-6 space-y-5">
              {CONTACT.map((block) => (
                <div key={block.label}>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-nissan-red">
                    {block.label}
                  </dt>
                  <dd className="mt-1 space-y-0.5 text-sm text-nissan-dark">
                    {(block.lines as Line[]).map((line, i) =>
                      typeof line === 'string' ? (
                        <p key={i}>{line}</p>
                      ) : (
                        <p key={i}>
                          <a href={line.href} className="transition hover:text-nissan-red">
                            {line.text}
                          </a>
                        </p>
                      ),
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
