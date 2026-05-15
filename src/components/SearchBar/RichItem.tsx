import { FoodHeritage } from '@/types';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FaMapPin } from 'react-icons/fa';
import { MRTColourLabel } from '../MrtLabel';
import SpicyIcon from '../SpicyIcon';

function RichItem({ data }: { data: FoodHeritage }) {
  const t = useTranslations('HeritageListView');

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
            <FaMapPin className="w-[1em] h-[1em]" />
            <span>{t(data.location.region)}</span>
          </div>
          {data.location.mrt_codes && <MRTColourLabel code={data.location.mrt_codes[0]} />}
          {data.spicy && <SpicyIcon />}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RichItem);
