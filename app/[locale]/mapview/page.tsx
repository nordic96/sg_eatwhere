import { geti18nConfig } from '@/i18n/request';
import ClientHome from './ClientHome';
import { AppResponse, FoodHeritage } from '../../types';
import { fetchApi, getGmapUrl, isTrailMode, isUsingTestData } from '../../utils';
import data from '@/resources/devData.json';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { messages } = await geti18nConfig(locale);
  let response: AppResponse<FoodHeritage[]> = { data: [] };
  if (isUsingTestData()) {
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
      trailMode={isTrailMode()}
      foods={response.error || response.data === null ? [] : response.data}
      gmapUrl={getGmapUrl()}
    />
  );
}
