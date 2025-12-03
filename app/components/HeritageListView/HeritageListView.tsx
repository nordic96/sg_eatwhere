'use client';

import Image from 'next/image';
import { CAT_ASSET_MAP, data } from '@/app/constants/data';
import { useHeritageStore } from '@/app/stores';
import { Region } from '@/app/types';
import { useMemo } from 'react';
import HighlightedText from '../HighlightText/HighlightText';
import { useTranslations } from 'next-intl';

interface HeritageListViewProps {
  region: Region;
}

export default function HeritageListView({ region }: HeritageListViewProps) {
  const { heritageId, setHeritageId, filter } = useHeritageStore();
  const t = useTranslations('HeritageListView');
  const heritageDataByRegion = useMemo(() => {
    return data.filter((v) => v.location.region === region);
  }, [region]);

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
                <Image
                  src={CAT_ASSET_MAP[location.category]}
                  width={40}
                  height={40}
                  alt={'category-icon'}
                  draggable="false"
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
