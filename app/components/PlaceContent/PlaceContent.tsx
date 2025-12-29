'use client';

import { useAppStore, useHeritageStore } from '@/app/stores';
import { MapOutlined, ThumbUpOutlined } from '@mui/icons-material';

import ImageCarousel from '../ImageCarousel/ImageCarousel';
import { cn } from '@/app/utils';
import VerticalDivider from '../VerticalDivider/VerticalDivider';
import { useTranslations } from 'next-intl';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import ButtonContainer from './ButtonContainer';
import { memo, useMemo } from 'react';
import { MrtLabel } from '../MrtLabel/MrtLabel';

const MIN_DESC_LEN = 50;
function PlaceContent() {
  const t = useTranslations('CardView');
  const catT = useTranslations('FoodCategory');
  const heritageT = useTranslations('Heritage');

  const { getThemeStyle, getSelectedFoodData } = useHeritageStore();
  const { openMore } = useAppStore();
  const heritageId = useHeritageStore((state) => state.heritageId);

  const data = getSelectedFoodData();
  const description = useMemo(() => (data ? heritageT(`${data.id}_desc`) : ''), [data, heritageT]);

  if (!heritageId || !data) {
    return <div>No data selected</div>;
  }

  const learnMoreBtnBaseStyle =
    'bg-primary py-0.5 px-4 rounded-lg text-white cursor-pointer text-md font-bold';
  return (
    <article
      role="article"
      aria-label="Selected location details"
      className={
        'relative flex flex-col items-end w-[384px] rounded-xl bg-white border border-[#333] overflow-hidden'
      }
    >
      {/** Carousel Container */}
      <div className={'w-full h-[280px]'}>
        <ImageCarousel img={data.imgSource} customClass={getThemeStyle()} />
      </div>
      <div className={'absolute top-1 w-full px-4'}>
        <ButtonContainer />
      </div>
      <div className="w-full flex flex-col gap-2 px-4 py-2">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-bold">{data.name}</span>
          <span className={'text-[#555]'}>{data.location.address}</span>
        </div>
        {/** Info Container */}
        <div
          className={'flex grow justify-start items-center gap-1 text-md bg-gray-50 p-1 rounded-md'}
        >
          <div className="flex gap-1 items-center">
            <CategoryIcon
              alt={'card-cat-icon'}
              cat={data.category}
              iconClass={'h-4'}
              className={'py-0.5 w-8'}
            />
            <span>{catT(data.category)}</span>
          </div>
          <VerticalDivider />
          <MrtLabel mrt={data.location.mrt[0]} />
          <VerticalDivider />
        </div>
        {/** Recommended Dish Container */}
        <div className="flex justify-between items-center gap-1 rounded-md bg-amber-50 p-1">
          <div className={'flex items-center gap-1'}>
            <ThumbUpOutlined fontSize={'small'} />
            <span className={'font-bold'}>{t('must_try')}</span>
          </div>
          <div className={'flex gap-1 flex-col'}>
            {data.recommendations.map((dish, i) => (
              <span
                key={i}
                className={
                  'px-1 py-0.5 flex justify-center border-goldenmile border bg-white rounded-xl'
                }
              >
                {dish}
              </span>
            ))}
          </div>
        </div>
        {/** Desc Container */}
        <div className="flex flex-col justify-start gap-4">
          <p className="font-light text-xs">
            {description.substring(0, Math.min(description.length, MIN_DESC_LEN))}
            {description.length > MIN_DESC_LEN ? '...' : ''}
          </p>
        </div>
        {/** Learn More Btn Container */}
        <div className="flex justify-center gap-2">
          <a
            className={cn(
              'flex flex-1 justify-center items-center gap-0.5 hover:bg-red-700',
              learnMoreBtnBaseStyle,
            )}
            href={data.location.gmapUrl}
            aria-label={'Get Map Directions'}
            target="_blank"
            rel={'noopener noreferrer'}
          >
            <MapOutlined fontSize={'small'} />
            <span>{t('directions')}</span>
          </a>
          <button
            className={cn('flex-1', learnMoreBtnBaseStyle, getThemeStyle())}
            onClick={openMore}
            aria-label="Learn more about this location"
          >
            {t('learnmore')}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(PlaceContent);
