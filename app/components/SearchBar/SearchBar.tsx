'use client';

import { useDebounce } from '@/app/hooks';
import useClickOutside from '@/app/hooks/useClickOutside';
import { useHeritageStore } from '@/app/stores';
import { FoodHeritage } from '@/app/types';
import { cn } from '@/app/utils';
import { AutoAwesome, Close, Search } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import RichItem from './RichItem';
import { useSemanticSearch } from '@/app/hooks/useSemanticSearch';
import { CircularProgress } from '@mui/material';

const DEBOUNCE_DELAY_MS = 200;
const MAX_INPUT_LEN = 100;
const DEFAULT_MIN_NO_RESULTS = 5;

export default function SearchBar() {
  const t = useTranslations('SearchBar');

  const containerRef = useRef<HTMLDivElement>(null);
  const { foodData, setHeritageId } = useHeritageStore();

  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<FoodHeritage[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const debouncedKeyword = useDebounce<string>(keyword, DEBOUNCE_DELAY_MS);

  const resultsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listboxId = useId();
  const inputId = useId();

  /** Search Related */
  const { search, isReady, isSearching } = useSemanticSearch(foodData);

  // Track active search to prevent stale results
  const searchAbortRef = useRef<AbortController | null>(null);

  // Memoize the search handler to avoid recreating on every render
  const performSearch = useCallback(
    async (query: string) => {
      // Cancel any pending search
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }

      // Create new abort controller for this search
      const abortController = new AbortController();
      searchAbortRef.current = abortController;

      try {
        const res = await search(query);

        // Check if this search was aborted
        if (abortController.signal.aborted) {
          return;
        }

        const resultsData = res
          .map((id) => foodData.find((f) => f.id === id))
          .filter((item): item is FoodHeritage => item !== undefined);

        setResults(resultsData);
        setSelectedIndex(-1);
      } catch (error) {
        // Only log if not aborted
        if (!abortController.signal.aborted) {
          console.error('Search error:', error);
        }
      }
    },
    [search, foodData],
  );

  useClickOutside(containerRef, () => {
    setIsActive(false);
  });

  // Effect to trigger search when debounced keyword changes
  useEffect(() => {
    // Clear results if no keyword or not ready
    if (!debouncedKeyword || !isReady) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    // Perform the search (do NOT include isSearching in dependencies)
    performSearch(debouncedKeyword);

    // Cleanup: abort search on unmount or when dependencies change
    return () => {
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
    };
  }, [debouncedKeyword, isReady, performSearch]);

  function resetResults() {
    setKeyword('');
    setSelectedIndex(-1);
  }

  useEffect(() => {
    resetResults();
  }, [isActive]);

  useEffect(() => {
    resultsRef.current = [];
  }, [results]);

  function onFocus() {
    if (debouncedKeyword === '') {
      setResults(foodData.slice(0, DEFAULT_MIN_NO_RESULTS));
    }
    setIsActive(true);
  }

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

  const showResults = isReady && isActive;
  const defaultLiStyle = 'px-2 py-1 rounded-lg cursor-pointer';
  const containerBaseWidthStyle = 'w-[500px] max-sm:w-full';

  return (
    <div ref={containerRef} className={'relative max-sm:w-full'}>
      <div
        className={cn(
          'relative h-full flex items-center gap-1 overflow-hidden',
          'border border-[#333] focus:border-primary rounded-2xl bg-white text-black px-5',
          'transition-opacity ease-in-out',
          { 'opacity-60': !isReady },
        )}
      >
        <LoadingProgress isReady={isReady} />
        <AISparkle isActive={isActive} isReady={isReady} />
        <SearchProgress isSearching={isSearching} />
        <input
          id={inputId}
          className={cn(containerBaseWidthStyle, 'h-7 max-sm:h-8 focus:outline-none px-2 ')}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          value={keyword}
          maxLength={MAX_INPUT_LEN}
          type={'text'}
          disabled={!isReady}
          onFocus={onFocus}
          onBlur={() => {
            setTimeout(() => setIsActive(false), 150);
          }}
          role={'combobox'}
          aria-expanded={showResults}
          aria-controls={showResults ? listboxId : undefined}
          aria-activedescendant={
            selectedIndex >= 0 ? `${listboxId}-option-${selectedIndex}` : undefined
          }
          aria-autocomplete={'list'}
          aria-label={'Search Food Locations'}
          placeholder={!isReady ? t('placeholder_loading') : t('placeholder')}
        />
        {/** Close Text Icon */}
        {debouncedKeyword.length > 0 && (
          <button
            onClick={() => setKeyword('')}
            className={
              'absolute right-6 top-[50%] translate-y-[-60%] w-6 h-6 cursor-pointer rounded-full text-gray-400 text-xl items-center justify-center'
            }
          >
            <Close fontSize={'inherit'} />
          </button>
        )}
      </div>
      {/** Search Result Container */}
      {showResults && (
        <ul
          id={listboxId}
          className={cn(
            containerBaseWidthStyle,
            'absolute left-[50%] -translate-x-[50%] z-50 bg-white rounded-lg flex flex-col gap-2 shadow-xl py-1',
          )}
          role={'listbox'}
        >
          {results.length === 0 ? (
            <li role={'option'} className={cn(defaultLiStyle, 'text-black')} aria-selected={false}>
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
                  setHeritageId(v.id);
                  resetResults();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <RichItem data={v} />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function SearchProgress({ isSearching }: { isSearching: boolean }) {
  return (
    <div
      className={cn('text-primary absolute right-2 top-[50%] text-xl', {
        '-translate-y-[40%]': isSearching,
        '-translate-y-[50%]': !isSearching,
      })}
    >
      {isSearching && <CircularProgress color={'inherit'} size={'16px'} thickness={8} />}
      {!isSearching && <Search fontSize={'inherit'} />}
    </div>
  );
}

function LoadingProgress({ isReady }: { isReady: boolean }) {
  return (
    <div
      className={cn(
        'text-primary absolute left-2 top-[50%] -translate-y-[40%] text-sm z-51',
        'transition-transform ease-in-out',
        {
          'translate-x-0': !isReady,
          '-translate-x-100': isReady,
        },
      )}
    >
      <CircularProgress color={'inherit'} size={'16px'} thickness={8} />
    </div>
  );
}

function AISparkle({ isReady, isActive }: { isReady: boolean; isActive: boolean }) {
  return (
    <div
      className={cn(
        'text-monsoongrey absolute left-2 top-[50%] -translate-y-[50%] text-sm z-51',
        'transition-transform ease-in-out',
        {
          'text-monsoongrey': !isActive,
          'text-primary': isActive,
          'translate-x-0': isReady,
          '-translate-x-100': !isReady,
        },
      )}
    >
      <AutoAwesome fontSize={'inherit'} />
    </div>
  );
}
