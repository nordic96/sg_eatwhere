'use client';

import Image from 'next/image';
import { CAT_ASSET_MAP } from '@/app/constants/data';
import { useHeritageStore } from '@/app/stores';
import { Region } from '@/app/types';
import HighlightedText from '../HighlightedText/HighlightedText';
import { useTranslations } from 'next-intl';
import { cn } from '@/app/utils';

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
                <div className="w-10 flex justify-center">
                  <Image
                    src={CAT_ASSET_MAP[location.category]}
                    className={cn({
                      'w-10': location.category !== 'dessert',
                      'w-7': location.category === 'dessert',
                    })}
                    width={'0'}
                    height={'0'}
                    alt={'category-icon'}
                    draggable="false"
                  />
                </div>
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
