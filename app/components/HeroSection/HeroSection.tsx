import { useTranslations } from 'next-intl';
import Image from 'next/image';
import FadeIn from '../FadeIn/FadeIn';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import AppLink from '../AppLink';
import { cn } from '@/app/utils';
import { ArrowRightAlt, Explore } from '@mui/icons-material';
import { h1BaseStyle, microTextBaseStyle } from '@/app/constants';

export default function HeroSection() {
  const t = useTranslations('LandingPage');
  return (
    <div className="mt-30 max-sm:mt-20">
      <div className="flex justify-between items-center">
        <div className="lg:w-[760px] max-sm:w-full flex flex-col gap-4 items-start">
          <FadeIn>
            <h1 className={cn(h1BaseStyle)}>
              {t.rich('hero_desc', {
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
            <p className={cn(microTextBaseStyle)}>{t('hero_micro_desc')}</p>
          </FadeIn>
          <div className="flex gap-4 max-sm:gap-1">
            <PrimaryButton className="flex items-center">
              <AppLink route={'/mapview'}>{t('explore_more')}</AppLink>
              <Explore />
            </PrimaryButton>
            <PrimaryButton className="flex bg-gardengreen hover:bg-green-600 items-center">
              <AppLink route={'/mapview'}>{t('discover_why')}</AppLink>
              <ArrowRightAlt />
            </PrimaryButton>
          </div>
        </div>
        <Image
          className={'w-[390px] max-sm:w-[200px]'}
          src={'/images/hero_img.svg'}
          width={'0'}
          height={'0'}
          draggable={false}
          alt={'landing_logo'}
        />
      </div>
    </div>
  );
}
