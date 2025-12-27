'use client';
import { useHeritageStore } from '@/app/stores';
import { Region } from '@/app/types';
import HighlightedText from '../HighlightText/HighlightText';
import { useTranslations } from 'next-intl';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import { useMemo } from 'react';

interface HeritageListViewProps {
  region: Region;
}

export default function HeritageListView({ region }: HeritageListViewProps) {
  const { heritageId, setHeritageId, filter } = useHeritageStore();
  const foodData = useHeritageStore((state) => state.foodData);
  const t = useTranslations('HeritageListView');

  const filteredLocations = useMemo(
    () =>
      foodData
        .filter((v) => v.location.region === region)
        .filter((val) => filter.includes(val.category)),
    [foodData, region, filter],
  );

  return (
    <nav className="flex flex-col gap-2" aria-label={`${t(region)} locations`}>
      <span className="font-medium text-[14px]">{t(region)}</span>
      <ul className="flex flex-col gap-2 max-sm:flex-row max-sm:overflow-x-auto max-sm:pb-2" role="list">
        {filteredLocations
          .filter((val) => filter.includes(val.category))
          .map((location) => {
            return (
              <li
                key={`list-view-${location.id}`}
                role="listitem"
                className="flex items-center gap-1 cursor-pointer max-sm:flex-shrink-0 max-sm:min-w-[150px] max-sm:flex-col max-sm:p-2 max-sm:border max-sm:border-[#ddd] max-sm:rounded-lg min-h-[44px] touch-manipulation"
                onClick={() => setHeritageId(location.id)}
                aria-current={location.id === heritageId ? 'location' : undefined}
              >
                <CategoryIcon
                  cat={location.category}
                  alt={'listview_category_icon'}
                  className={'max-sm:min-w-10'}
                />
                {location.id === heritageId ? (
                  <HighlightedText>
                    <span className="text-[12px] max-sm:text-center">{location.name}</span>
                  </HighlightedText>
                ) : (
                  <span className="text-[12px] cursor-pointer max-sm:text-center">{location.name}</span>
                )}
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
