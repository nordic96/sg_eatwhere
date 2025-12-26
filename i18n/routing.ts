import { defineRouting } from 'next-intl/routing';
import { AvailableLocales } from './locales';

export const routing = defineRouting({
  locales: AvailableLocales,
  defaultLocale: 'en',
});
