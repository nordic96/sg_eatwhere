import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export async function geti18nConfig() {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
}

export default getRequestConfig(async () => geti18nConfig());
