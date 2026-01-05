import { FoodHeritage } from '../types';
import { AvailableLocales } from '@/i18n/locales';
import { geti18nConfig } from '@/i18n/request';

export type SearchableData = FoodHeritage & { desc?: string };
export async function prepareSearchData(items: FoodHeritage[]): Promise<SearchableData[]> {
  const localeDataPromises = AvailableLocales.map((locale) => geti18nConfig(locale));
  const localeConfigs = await Promise.all(localeDataPromises);
  const localeData = localeConfigs.map((config) => config.messages);

  const preparedData = items.map((x) => {
    const newData: SearchableData = Object.assign({}, x);
    let descStr = '';
    for (const messages of localeData) {
      descStr = descStr.concat(' ', messages['Heritage'][`${x.id}_desc`]);
    }
    newData.desc = descStr;
    return newData;
  });

  return preparedData;
}

export function searchForKeyword<T extends object>(keyword: string, items: T[]): T[] {
  const lowerKeyword = keyword.toLowerCase();
  return items.filter((item) => {
    return Object.values(item).some((val) => {
      if (Array.isArray(val)) {
        return val.some((el) => String(el).toLowerCase().includes(lowerKeyword));
      }
      return String(val).toLowerCase().includes(lowerKeyword);
    });
  });
}
