'use client';

import { useDebounce } from '@/app/hooks';
import { useHeritageStore } from '@/app/stores';
import { FoodHeritage } from '@/app/types';
import { AvailableLocales } from '@/i18n/locales';
import { geti18nConfig } from '@/i18n/request';
import { Search } from '@mui/icons-material';
import { Activity, useEffect, useState } from 'react';

function searchForKeyword<T extends object>(keyword: string, items: T[]): T[] {
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

type SearchableData = FoodHeritage & { desc?: string };
async function prepareSearchData(items: FoodHeritage[]): Promise<SearchableData[]> {
  const localeData: Record<string, Record<string, string>>[] = [];

  for (const locale of AvailableLocales) {
    const { messages } = await geti18nConfig(locale);
    localeData.push(messages);
  }
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

export default function SearchBar() {
  const { foodData } = useHeritageStore();
  const [loading, setLoading] = useState(false);
  const [searchableData, setSearchableData] = useState<SearchableData[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const debouncedKeyword = useDebounce<string>(keyword, 500);

  useEffect(() => {
    async function loadSearchData() {
      setLoading(true);
      await prepareSearchData(foodData)
        .then((data) => {
          setSearchableData(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (foodData.length > 0) {
      loadSearchData();
    }
  }, [foodData]);

  useEffect(() => {
    if (!debouncedKeyword || loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    const res = searchForKeyword<SearchableData>(debouncedKeyword, searchableData);
    setResults(res.map((x) => x.id));
  }, [debouncedKeyword, searchableData, loading]);

  return (
    <div className={'relative'}>
      <div className={'relative h-full flex items-center gap-1'}>
        <input
          className={'rounded-2xl h-6 w-[500px] border-2 border-[#333] focus:border-primary px-2'}
          onChange={(e) => setKeyword(e.target.value)}
          type={'text'}
        />
        <div
          className={
            'absolute right-0 top-[50%] translate-y-[-60%] w-6 h-6 cursor-pointer rounded-full text-primary text-xl items-center justify-center'
          }
        >
          <Search fontSize={'inherit'} />
        </div>
        <Activity mode={loading ? 'visible' : 'hidden'}>Loading...</Activity>
      </div>
      {/** Search Result Container */}
      {debouncedKeyword !== '' && (
        <div className={'absolute w-[500px] z-999 p-2 bg-white rounded-lg flex flex-col gap-4'}>
          {results.length === 0 ? (
            <span>No Search Results Found</span>
          ) : (
            results.map((v, i) => <span key={i}>{v}</span>)
          )}
        </div>
      )}
    </div>
  );
}
