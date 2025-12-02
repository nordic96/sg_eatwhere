import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export async function geti18nConfig() {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';
  let message;
  try {
    message = (await import(`@/messages/${locale}.json`)).default;
  } catch (e) {
    console.error(e);
    message = (await import('@/messages/en.json')).default;
  }

  return {
    locale,
    messages: message,
  };
}

export default getRequestConfig(async () => geti18nConfig());
