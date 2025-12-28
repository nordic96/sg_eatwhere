'use client';

import { useDebounce } from '@/app/hooks';
import useClickOutside from '@/app/hooks/useClickOutside';
import { useHeritageStore } from '@/app/stores';
import { FoodHeritage } from '@/app/types';
import { cn } from '@/app/utils';
import { AvailableLocales } from '@/i18n/locales';
import { geti18nConfig } from '@/i18n/request';
import { Search } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Activity, useEffect, useId, useRef, useState } from 'react';

const DEBOUNCE_DELAY_MS = 200;

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
  const t = useTranslations('SearchBar');

  const containerRef = useRef<HTMLDivElement>(null);
  const { foodData, setHeritageId } = useHeritageStore();
  const [loading, setLoading] = useState(false);
  const [searchableData, setSearchableData] = useState<SearchableData[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<FoodHeritage[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const debouncedKeyword = useDebounce<string>(keyword, DEBOUNCE_DELAY_MS);

  const resultsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listboxId = useId();
  const inputId = useId();

  useClickOutside(containerRef, () => {
    setIsActive(false);
  });

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
      setSelectedIndex(-1);
      return;
    }
    const res = searchForKeyword<SearchableData>(debouncedKeyword, searchableData);
    setResults(res);
    setSelectedIndex(-1);
  }, [debouncedKeyword, searchableData, loading]);

  function resetResults() {
    setKeyword('');
    setSelectedIndex(-1);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetResults();
  }, [isActive]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length <= 0) {
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'Tab') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setHeritageId(results[selectedIndex].id);

      resetResults();
    } else if (e.key === 'Escape') {
      resetResults();
    }
  }

  const showResults = debouncedKeyword !== '' && !loading && isActive;
  const defaultLiStyle = 'px-2 py-1 max-sm:py-4 rounded-lg';
  const containerBaseWidthStyle = 'w-[500px] max-sm:w-full';

  return (
    <div ref={containerRef} className={'relative max-sm:w-full'}>
      <div className={'relative h-full flex items-center gap-1'}>
        <input
          id={inputId}
          className={cn(
            containerBaseWidthStyle,
            'rounded-2xl h-6 max-sm:h-8 border border-[#333] focus:border-primary focus:outline-none px-2',
          )}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          value={keyword}
          type={'text'}
          disabled={loading}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          role={'combobox'}
          aria-expanded={showResults}
          aria-controls={showResults ? listboxId : undefined}
          aria-activedescendant={
            selectedIndex >= 0 ? `${listboxId}-option-${selectedIndex}` : undefined
          }
          aria-autocomplete={'list'}
          aria-label={'Search Food Locations'}
          placeholder={t('placeholder')}
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
        <ul
          className={cn(
            containerBaseWidthStyle,
            'absolute z-999 bg-white rounded-lg flex flex-col gap-2',
          )}
          role={'listbox'}
        >
          {results.length === 0 ? (
            <li role={'listitem'} className={cn(defaultLiStyle)}>
              {t('no_results')}
            </li>
          ) : (
            results.map((v, i) => (
              <li
                key={i}
                id={`${listboxId}-option-${i}`}
                role={'option'}
                ref={(el) => {
                  resultsRef.current[i] = el;
                }}
                className={cn(defaultLiStyle, {
                  'bg-primary': selectedIndex === i,
                  'text-white': selectedIndex === i,
                  'text-black': selectedIndex !== i,
                })}
                aria-selected={selectedIndex === i}
                onClick={() => {
                  setHeritageId(results[selectedIndex].id);
                  resetResults();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {v.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
