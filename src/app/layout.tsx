import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Data Professional',
    template: '%s · Data Professional',
  },
  description:
    'Insights on data engineering, pipelines, cloud infrastructure, and the modern data stack — by a practicing data professional.',
  metadataBase: new URL('https://dataprofessional.blog'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Data Professional',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#f8f9fc] text-gray-900 antialiased`}>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-10 min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
