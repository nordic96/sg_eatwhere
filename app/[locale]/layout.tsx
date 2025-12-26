import type { Metadata, Viewport } from 'next';
import { Public_Sans, Roboto } from 'next/font/google';

import './globals.css';
import '@/node_modules/flag-icons/css/flag-icons.min.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

import Banner from '../components/Banner/Banner';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cn } from '../utils';
import { baseLayoutStyle } from '../constants/theme';
/** Speed & Insights Analytics */
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.7,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "The Foodie's Trail SG",
  description:
    'Personal web project to introduce hidden gems of local restaurants/hawkerstalls/desserts in Singapore.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${roboto.variable} ${publicSans.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <div id="root">
            <Header />
            <Banner msg={'banner_msg'} />
            <div className={'flex justify-center grow h-scren'}>
              <div className={cn('flex grow flex-col', baseLayoutStyle)}>{children}</div>
            </div>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
