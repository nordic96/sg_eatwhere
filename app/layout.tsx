import type { Metadata, Viewport } from 'next';
import { Public_Sans, Roboto } from 'next/font/google';

import './globals.css';
import '@/node_modules/flag-icons/css/flag-icons.min.css';

import Header from './components/Header';
import Footer from './components/Footer';

import Banner from './components/Banner/Banner';
import { NextIntlClientProvider, useTranslations } from 'next-intl';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations('Banner');
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${publicSans.variable} antialiased`}>
        <NextIntlClientProvider>
          <div id="root">
            <Header />
            <Banner msg={t('banner_msg')} />
            <div className={'flex justify-center grow h-scren'}>
              <div className="flex grow flex-col max-w-[1440px] px-8">{children}</div>
            </div>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
