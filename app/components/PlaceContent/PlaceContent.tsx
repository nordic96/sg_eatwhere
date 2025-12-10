'use client';

import { useHeritageStore } from '@/app/stores';
import { MapOutlined, SubwayOutlined, ThumbUpOutlined } from '@mui/icons-material';

import HighlightedText from '../HighlightText/HighlightText';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import { cn } from '@/app/utils';
import VerticalDivider from '../VerticalDivider/VerticalDivider';
import { useTranslations } from 'next-intl';
import CategoryIcon from '../CategoryIcon/CategoryIcon';

export default function PlaceContent() {
  const t = useTranslations('CardView');
  const catT = useTranslations('FoodCategory');
  const heritageT = useTranslations('Heritage');

  const { openMore, getThemeStyle, getSelectedFoodData } = useHeritageStore();
  const heritageId = useHeritageStore((state) => state.heritageId);

  const data = getSelectedFoodData();

  if (!heritageId || !data) {
    return <div>No data selected</div>;
  }

  const learnMoreBtnBaseStyle =
    'bg-primary py-0.5 px-4 rounded-lg text-white cursor-pointer text-md font-bold';
  return (
    <div className="w-full flex flex-col gap-2">
      {/** Carousel Container */}
      <div className={'relative w-full h-[280px]'}>
        <ImageCarousel img={data.imgSource} customClass={getThemeStyle()} />
        <span className="absolute bottom-0 left-[50%] translate-x-[-50%] text-center text-white">
          <p className="text-4xl w-[300px] font-bold">{data.name}</p>
          <p>{data.location.address}</p>
        </span>
      </div>
      {/** Info Container */}
      <div className={'flex grow justify-start items-center gap-1 text-md'}>
        <span className="flex gap-1 items-center">
          <CategoryIcon
            alt={'card-cat-icon'}
            cat={data.category}
            iconClass={'h-4'}
            className={'py-0.5 w-8'}
          />
          {catT(data.category)}
        </span>
        <VerticalDivider />
        <MrtLabel mrt={data.location.mrt[0]} />
        <VerticalDivider />
        <a href={data.location.gmapUrl} target="_blank">
          <MapOutlined fontSize={'small'} />
        </a>
        <VerticalDivider />
      </div>
      {/** Desc Container */}
      <div className="flex flex-col mt-2 justify-center items-center gap-4">
        <span className="flex justify-center items-center gap-1">
          <ThumbUpOutlined />
          <div>
            {data.recommendations.map((dish, i) => (
              <HighlightedText key={i}>{dish}</HighlightedText>
            ))}
          </div>
        </span>
        <p className="font-light text-xs">
          {heritageT(`${data.id}_desc`).substring(
            0,
            Math.min(heritageT(`${data.id}_desc`).length, 100),
          )}
          {heritageT(`${data.id}_desc`).length > 100 ? '...' : ''}
        </p>
      </div>
      {/** Learn More Btn Container */}
      <div className="flex justify-center">
        <button className={cn(learnMoreBtnBaseStyle, getThemeStyle())} onClick={openMore}>
          {t('learnmore')}
        </button>
      </div>
    </div>
  );
}

export function MrtLabel({ mrt }: { mrt: string }) {
  const mrtT = useTranslations('MRT');
  return (
    <span className="flex gap-1 items-center">
      <SubwayOutlined fontSize="small" />
      <p className="font-public-sans font-medium max-w-22 wrap-break-word">{mrtT(mrt)}</p>
    </span>
  );
}
