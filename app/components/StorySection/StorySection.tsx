import { cn } from '@/app/utils';
import FadeIn from '../FadeIn/FadeIn';
import { useTranslations } from 'next-intl';
import { h1BaseStyle, microTextBaseStyle } from '@/app/constants';
import { PhotoCamera } from '@mui/icons-material';
import Image from 'next/image';
import { CDN_BASE } from '@/app/config/cdn';

export default function StorySection() {
  const t = useTranslations('LandingPage');
  return (
    <div>
      <div className="flex justify-between items-center max-sm:flex-col">
        <div className="relative flex grow flex-col gap-4 items-start min-h-[400px] overflow-x-hidden">
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
          <Image
            src={`${CDN_BASE}/resources/images/film_canister.png`}
            alt={'film_canister'}
            draggable={false}
            className={
              'h-[275px] w-auto absolute right-10 max-sm:-right-[20vw] top-[105px] max-sm:top-[110px] z-50'
            }
            width={275}
            height={275}
            priority
          />
          <div className="absolute overflow-x-hidden top-[125px] max-sm:top-[130px] w-[1100px] max-sm:w-[200vw] right-[198px] max-sm:right-12 block">
            <div className="flex animate-marquee">
              <Image
                className={'lg:w-[1100px] max-sm:w-[200vw]'}
                src={`${CDN_BASE}/resources/images/landing_film.png`}
                alt={'landing_logo'}
                draggable={false}
                width={1100}
                height={1100}
              />
              <Image
                className={'lg:w-[1100px] max-sm:w-[200vw]'}
                src={`${CDN_BASE}/resources/images/landing_film.png`}
                alt={'landing_logo'}
                draggable={false}
                width={1100}
                height={1100}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <PhotoCamera />
              <p className="font-light italic text-sm">{t('photo_disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
