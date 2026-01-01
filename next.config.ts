import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_CDN_BASE || 'https://cdn.jsdelivr.net'}/**`),
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
