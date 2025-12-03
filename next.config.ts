import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
