import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { CDN_BASE } from '@/app/config/cdn';

export async function geti18nConfig(locale: string) {
  let messages;
  try {
    const res = await fetch(`${CDN_BASE}/messages/${locale}.json`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      // Basic validation - ensure we got a valid object
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        messages = data;
      } else {
        throw new Error('Invalid locale file format from CDN');
      }
    } else {
      // HTTP error (404, 500, etc.) - fallback to local
      console.warn(`CDN returned ${res.status} for ${locale}, using local fallback`);
      messages = (await import(`@/messages/${locale}.json`)).default;
    }
  } catch (e) {
    // Network failure or CDN issue - try local locale first, then English
    console.error('CDN fetch failed, falling back to local:', e);
    try {
      messages = (await import(`@/messages/${locale}.json`)).default;
    } catch (importError) {
      console.error('Local import failed, using English default:', importError);
      messages = (await import('@/messages/en.json')).default;
    }
  }

  return {
    locale,
    messages,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const { messages } = await geti18nConfig(locale);

  return {
    locale,
    messages: messages,
  };
});
