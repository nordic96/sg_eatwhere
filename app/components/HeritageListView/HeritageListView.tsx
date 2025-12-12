'use client';
import { useHeritageStore } from '@/app/stores';
import { Region } from '@/app/types';
import HighlightedText from '../HighlightText/HighlightText';
import { useTranslations } from 'next-intl';
import CategoryIcon from '../CategoryIcon/CategoryIcon';

interface HeritageListViewProps {
  region: Region;
}

export default function HeritageListView({ region }: HeritageListViewProps) {
  const { heritageId, setHeritageId, filter, getFoodData } = useHeritageStore();
  const t = useTranslations('HeritageListView');
  const heritageDataByRegion = getFoodData().filter((v) => v.location.region === region);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-[14px]">{t(region)}</label>
      <div className="flex flex-col gap-2">
        {heritageDataByRegion
          .filter((val) => filter.includes(val.category))
          .map((location) => {
            return (
              <div
                key={`list-view-${location.id}`}
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setHeritageId(location.id)}
              >
                <CategoryIcon
                  cat={location.category}
                  alt={'listview_category_icon'}
                  className={'max-sm:min-w-10'}
                />
                {location.id === heritageId ? (
                  <HighlightedText>
                    <label className="text-[12px]">{location.name}</label>
                  </HighlightedText>
                ) : (
                  <label className="text-[12px] cursor-pointer">{location.name}</label>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
