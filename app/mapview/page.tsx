import { geti18nConfig } from '@/i18n/request';
import ClientHome from './ClientHome';
import { AppResponse, FoodHeritage } from '../types';
import { fetchApi } from '../utils';
import data from '@/resources/devData.json';

export default async function Page() {
  const { messages, locale } = await geti18nConfig();
  let response: AppResponse<FoodHeritage[]> = { data: [] };
  if (process.env.USE_TEST_DATA === 'true') {
    response = await new Promise((res) => {
      setTimeout(() => {
        res({ data: JSON.parse(JSON.stringify(data)) });
      }, 2000);
    });
  } else {
    response = await fetchApi<FoodHeritage[]>(process.env.DATA_URL || '');
  }
  return (
    <ClientHome
      messages={messages}
      locale={locale}
      foods={response.error || response.data === null ? [] : response.data}
    />
  );
}
