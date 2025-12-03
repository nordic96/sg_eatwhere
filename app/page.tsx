import { geti18nConfig } from '@/i18n/request';
import ClientHome from './ClientHome';

export default async function Page() {
  const { messages, locale } = await geti18nConfig();
  return <ClientHome messages={messages} locale={locale} />;
}
