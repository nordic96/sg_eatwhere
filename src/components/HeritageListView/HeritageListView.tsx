'use client';
import { useHeritageStore } from '@/stores';
import { Region } from '@/types';
import { useTranslations } from 'next-intl';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import { useMemo } from 'react';
import SpicyIcon from '../SpicyIcon';
import { MRTColourLabel } from '../MrtLabel';
import { cn } from '@/utils/cn';

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

  if (filteredLocations.length <= 0) {
    return null;
  }

  return (
    <nav className={'flex flex-1 flex-col gap-2'} aria-label={`${t(region)} locations`}>
      <span className="font-medium text-[14px]">{t(region)}</span>
      <ul className="flex flex-col gap-2" role="list">
        {filteredLocations
          .filter((val) => filter.includes(val.category))
          .map((location) => {
            return (
              <li
                key={`list-view-${location.id}`}
                role="listitem"
                className={cn(
                  'flex items-center gap-1 cursor-pointer p-1 rounded-lg',
                  'hover:bg-primary hover:text-white',
                  location.id === heritageId ? 'bg-primary text-white' : undefined,
                )}
                onClick={() => setHeritageId(location.id)}
                aria-current={location.id === heritageId ? 'location' : undefined}
              >
                <CategoryIcon
                  cat={location.category}
                  alt={'listview_category_icon'}
                  className={'max-sm:min-w-10'}
                />
                <div>
                  {/** Location Name Container */}
                  {<span className="text-sm max-sm:text-sm cursor-pointer">{location.name}</span>}
                  {/** MRT & Metadata Icons Container */}
                  <div className={'flex gap-1 items-center max-sm:flex-col max-sm:items-start'}>
                    {location.location.mrt_codes && (
                      <div className={'flex gap-1 max-sm:flex-col'}>
                        {location.location.mrt_codes.map((code, i) => {
                          return (
                            <div key={`mrt-${code}-${i}`}>
                              <MRTColourLabel code={code} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {location.spicy && <SpicyIcon />}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
