import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nissan Cagayan de Oro | Official Nissan Dealer',
  description:
    'Discover the full Nissan lineup, exclusive promos, and after-sales service at Nissan Cagayan de Oro. Book a test drive today.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
