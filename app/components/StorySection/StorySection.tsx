import { cn } from '@/app/utils';
import FadeIn from '../FadeIn/FadeIn';
import { useTranslations } from 'next-intl';
import { h1BaseStyle, microTextBaseStyle } from '@/app/constants';
import { PhotoCamera } from '@mui/icons-material';

/* eslint-disable @next/next/no-img-element */
export default function StorySection() {
  const t = useTranslations('LandingPage');
  return (
    <div>
      <div className="flex justify-between items-center max-sm:flex-col">
        <div className="relative flex grow flex-col gap-4 items-start min-h-[400px]">
          <FadeIn className="w-[760px] max-sm:w-full">
            <h1 className={cn(h1BaseStyle)}>
              {t.rich('landing2_desc', {
                primary: (chunks) => <span className="text-primary text-shadow-xl">{chunks}</span>,
                orange: (chunks) => (
                  <span className="text-outramorange text-shadow-xl">{chunks}</span>
                ),
                red: (chunks) => <span className="text-red-600 text-shadow-xl">{chunks}</span>,
                green: (chunks) => (
                  <span className="text-gardengreen text-shadow-xl">{chunks}</span>
                ),
              })}
            </h1>
            <p className={cn(microTextBaseStyle)}>{t('landing2_desc_2')}</p>
          </FadeIn>
          <img
            src={'/images/film_canister.png'}
            alt={'film_canister'}
            draggable={false}
            className={'h-[200px] max-sm:h-[140px] w-auto absolute right-0 top-[105px]'}
          />
          <div className="absolute overflow-x-hidden top-[120px] w-[800px] max-sm:w-[95vw] right-[115px] max-sm:right-20 block">
            <div className="flex animate-marquee">
              <img
                className={'lg:w-[800px] max-sm:w-[95vw]'}
                src={'/images/landing_film.png'}
                alt={'landing_logo'}
                draggable={false}
              />
              <img
                className={'lg:w-[800px] max-sm:w-[95vw]'}
                src={'/images/landing_film.png'}
                alt={'landing_logo'}
                draggable={false}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <PhotoCamera />
              <p className="font-light text-base max-sm:text-md">{t('photo_disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
