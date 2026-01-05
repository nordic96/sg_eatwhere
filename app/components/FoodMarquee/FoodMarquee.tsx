'use client';

import CategoryIcon from '@/app/components/CategoryIcon/CategoryIcon';
import Tooltip from '@/app/components/Tooltip/Tooltip';
import { useHeritageStore } from '@/app/stores';
import { FoodMarqueeItem } from '@/app/types';
import { cn, shuffle } from '@/app/utils';
import { CameraAlt, PauseCircle, PlayCircle, SubwayOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface FoodMarqueeProps {
  items: FoodMarqueeItem[];
  shuffleArr?: boolean;
}
export default function FoodMarquee({ items, shuffleArr = true }: FoodMarqueeProps) {
  const t = useTranslations('HomePage');
  const [isPaused, setIsPaused] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shuffledItems = useMemo(() => (shuffleArr ? shuffle(items) : items), [items, shuffleArr]);

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
    return shuffledItems.map(({ src, id }, i) => {
      return <FoodMarqueeItemComp key={`${keyPrefix}-${i}`} src={src} id={id} index={i} />;
    });
  }

  const togglePause = () => {
    setIsPaused((p) => {
      const newState = !p;
      setAnnounceMessage(t(newState ? 'marquee_paused' : 'marquee_playing'));
      return newState;
    });
  };

  return (
    <section className={'w-full'} aria-labelledby="featured-food-heading">
      {/** Title Container */}
      <div className={'flex justify-between items-center'}>
        <div className={'flex items-center'}>
          <CameraAlt fontSize={'medium'} aria-hidden="true" />
          <h2 id="featured-food-heading" className={'font-bold text-lg'}>
            {t('featured_food_spots')}
          </h2>
        </div>
        {/** Button Container */}
        <Tooltip
          direction={'left'}
          content={t(isPaused ? 'play_marquee' : 'pause_marquee')}
          className={'w-20'}
        >
          <button
            className={'hover:cursor-pointer text-primary'}
            onClick={togglePause}
            aria-label={t(isPaused ? 'play_marquee' : 'pause_marquee')}
          >
            {isPaused ? <PlayCircle aria-hidden="true" /> : <PauseCircle aria-hidden="true" />}
          </button>
        </Tooltip>
      </div>
      {/** Live region for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announceMessage}
      </div>
      {/** Marquee Container */}
      <div
        className={'relative w-full flex h-40 overflow-x-hidden'}
        role="region"
        aria-label={t('featured_food_spots')}
      >
        <div
          {...handlers}
          ref={scrollContainerRef}
          className="absolute flex overflow-hidden group bg-[#333] cursor-grab active:cursor-grabbing"
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
    </section>
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

  const handleClick = () => setHeritageId(id);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setHeritageId(id);
    }
  };

  return (
    <div
      className={'relative cursor-pointer w-40 h-40 shrink-0 transition-transform hover:scale-105'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${data.name} at ${mrtT(data.location.mrt[0])}`}
    >
      <Image
        className={'object-cover w-full h-full rounded-sm'}
        priority={index < 5}
        alt={`${data.name}, ${data.category} near ${mrtT(data.location.mrt[0])} MRT station`}
        src={src}
        width={160}
        height={160}
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>
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
