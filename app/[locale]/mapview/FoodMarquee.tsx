'use client';

import CategoryIcon from '@/app/components/CategoryIcon/CategoryIcon';
import Tooltip from '@/app/components/Tooltip/Tooltip';
import { useHeritageStore } from '@/app/stores';
import { cn, shuffle } from '@/app/utils';
import { CameraAlt, PauseCircle, PlayCircle, SubwayOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export type FoodMarqueeItem = {
  src: string;
  id: string;
};

interface FoodMarqueeProps {
  items: FoodMarqueeItem[];
  shuffleArr?: boolean;
}
export default function FoodMarquee({ items, shuffleArr = true }: FoodMarqueeProps) {
  const t = useTranslations('HomePage');
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      }
    },
    onSwipedRight: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  function generateImages(keyPrefix: string) {
    let arr = items;
    if (shuffleArr) {
      arr = shuffle(arr);
    }
    return arr.map(({ src, id }, i) => {
      return <FoodMarqueeItemComp key={`${keyPrefix}-${i}`} src={src} id={id} index={i} />;
    });
  }

  return (
    <div className={'w-full'}>
      {/** Title Container */}
      <div className={'flex justify-between items-center'}>
        <div className={'flex items-center'}>
          <CameraAlt fontSize={'medium'} />
          <span className={'font-bold text-lg'}>{t('featured_food_spots')}</span>
        </div>
        {/** Button Container */}
        <Tooltip
          direction={'left'}
          content={t(isPaused ? 'play_marquee' : 'pause_marquee')}
          className={'w-20'}
        >
          <button
            className={'hover:cursor-pointer text-primary'}
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? 'Play Marquee' : 'Pause Marquee'}
          >
            {isPaused ? <PlayCircle /> : <PauseCircle />}
          </button>
        </Tooltip>
      </div>
      {/** Marquee Container */}
      <div className={'relative w-full flex h-48 overflow-x-hidden'}>
        <div
          {...handlers}
          ref={scrollContainerRef}
          className="absolute flex overflow-hidden group bg-[#333] cursor-grab active:cursosr-grabbing"
        >
          <div
            className={cn(
              { 'animate-food-marquee': isPaused ? false : true },
              'flex gap-1 group-hover:[animation-play-state:paused]',
            )}
          >
            {generateImages('set1')}
          </div>
          <div
            className={cn(
              { 'animate-food-marquee': isPaused ? false : true },
              'ml-1 flex gap-1 group-hover:[animation-play-state:paused]',
            )}
          >
            {generateImages('set2')}
          </div>
        </div>
      </div>
    </div>
  );
}

function FoodMarqueeItemComp({ src, id, index }: FoodMarqueeItem & { index: number }) {
  const mrtT = useTranslations('MRT');

  const setHeritageId = useHeritageStore((state) => state.setHeritageId);
  const getFoodDataById = useHeritageStore((state) => state.getFoodDataById);
  const data = getFoodDataById(id);
  if (data === null) {
    return null;
  }
  return (
    <div
      className={'relative cursor-pointer w-40 h-40 shrink-0 transition-transform hover:scale-105'}
      onClick={() => setHeritageId(id)}
    >
      <Image
        className={'object-cover w-full h-full rounded-sm'}
        priority={index < 5}
        alt={`Food Heritage ${id}`}
        src={src}
        width={160}
        height={160}
        quality={90}
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 to-transparent"></div>
      <div className={'absolute flex flex-col text-white bottom-2 w-full px-2 text-left'}>
        <CategoryIcon alt={'category'} cat={data.category} />
        <span className={'font-extrabold text-xs'}>{data.name}</span>
        <div className={'flex text-xs'}>
          <div>
            <SubwayOutlined fontSize={'inherit'} />
            <span>{mrtT(data.location.mrt[0])}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
