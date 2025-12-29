import { FoodHeritage } from '@/app/types';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import { LocationPin, Subway } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import React from 'react';

function RichItem({ data }: { data: FoodHeritage }) {
  const t = useTranslations('HeritageListView');
  const tMrt = useTranslations('MRT');

  return (
    <div className={'flex gap-4 items-center'}>
      {/** Img Container */}
      <CategoryIcon className={'w-8 h-8'} alt={'cat-icon'} cat={data.category} />
      {/** Details Container */}
      <div className={'flex flex-col gap-0.5'}>
        {/** Title Container */}
        <span className={'text-sm'}>{data.name}</span>
        {/** MetaData Container */}
        <div className={'flex text-xs gap-2'}>
          <div className={'flex items-center'}>
            <LocationPin fontSize={'inherit'} />
            <span>{t(data.location.region)}</span>
          </div>
          <div className={'flex items-center'}>
            <Subway fontSize={'inherit'} />
            <span>{tMrt(data.location.mrt[0])}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RichItem);
