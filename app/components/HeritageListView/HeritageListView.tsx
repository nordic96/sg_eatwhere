/* eslint-disable @next/next/no-img-element */
'use client';

import { CAT_ASSET_MAP, data } from '@/app/constants/data';
import { useHeritageStore } from '@/app/stores';
import { Region } from '@/app/types';
import { useMemo } from 'react';
import HighlightedText from '../HighlightText/HighlightText';

interface HeritageListViewProps {
  region: Region;
}

export default function HeritageListView({ region }: HeritageListViewProps) {
  const { heritageId, setHeritageId } = useHeritageStore();
  const heritageDataByRegion = useMemo(() => {
    return data.filter((v) => v.location.region === region);
  }, [region]);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-[14px]">{`${region} Region`}</label>
      <div className="flex flex-col gap-2">
        {heritageDataByRegion.map((location) => {
          return (
            <div
              key={`list-view-${location.id}`}
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setHeritageId(location.id)}
            >
              <img src={CAT_ASSET_MAP[location.category]} className={'h-8'} alt={'category-icon'} />
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
