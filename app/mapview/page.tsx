import { geti18nConfig } from '@/i18n/request';
import ClientHome from './ClientHome';
import { FoodHeritage } from '../types';
import { fetchApi } from '../utils';

export default async function Page() {
  const { messages, locale } = await geti18nConfig();
  const data = await fetchApi<FoodHeritage[]>(process.env.DATA_URL || '');
  return <ClientHome messages={messages} locale={locale} foods={data.data || []} />;
}
