import { FoodHeritage } from '@/types';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FaMapPin } from 'react-icons/fa';
import { MRTColourLabel } from '../MrtLabel';
import { FoodTagIcon } from '../FoodTagIcon';

function RichItem({ data }: { data: FoodHeritage }) {
  const heritageT = useTranslations('Heritage');
  const t = useTranslations('HeritageListView');

  return (
    <div className={'flex gap-4 items-center'} data-testid={`richitem-${data.id}`}>
      {/** Img Container */}
      <CategoryIcon className={'w-8 h-8'} alt={'cat-icon'} cat={data.category} />
      {/** Details Container */}
      <div className={'flex flex-col gap-0.5'}>
        {/** Title Container */}
        <span className={'text-sm'}>
          {heritageT.has(data.id) ? `${heritageT(data.id)} (${data.name})` : data.name}
        </span>
        {/** MetaData Container */}
        <div className={'flex text-xs gap-2'}>
          <div className={'flex items-center'}>
            <FaMapPin className="w-[1em] h-[1em]" />
            <span>{t(data.location.region)}</span>
          </div>
          {data.location.mrt_codes && <MRTColourLabel code={data.location.mrt_codes[0]} />}
          {data.tags?.map((tag, i) => {
            return <FoodTagIcon tagType={tag} showLabel key={`richitem-foodtag-${tag}-${i}`} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RichItem);
