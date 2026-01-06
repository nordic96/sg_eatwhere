import { h1BaseStyle, microTextBaseStyle } from '../../constants';
import FadeIn from '../../components/FadeIn/FadeIn';
import NameCard from '../../components/NameCard/NameCard';
import StatsBar from '../../components/StatsBar';
import Section from '../../components/Section';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CDN_BASE } from '@/app/config/cdn';

export default function Page() {
  const t = useTranslations('AboutPage');
  const tStats = useTranslations('StatsBar');

  const stats = [
    { value: tStats('years_value'), label: tStats('years_label') },
    { value: tStats('spots_value'), label: tStats('spots_label') },
    { value: tStats('languages_value'), label: tStats('languages_label') },
    { value: tStats('project_value'), label: tStats('project_label') },
  ];

  return (
    <div className={'py-16'}>
      <div
        className={
          'lg:grid-cols-2 lg:grid-rows-1 lg:grid max-sm:flex max-sm:flex-col max-sm:gap-16 items-center'
        }
      >
        <div className={'min-w-[40vw]'}>
          <FadeIn>
            <Image
              alt={'me'}
              className={'w-full max-w-[500px]'}
              draggable={false}
              width={500}
              height={500}
              quality={95}
              src={`${CDN_BASE}/resources/images/about_me.png`}
            />
            <span className={'flex justify-center'}>{'-Illustration designed by Gihun Ko'}</span>
          </FadeIn>
        </div>
        <div className={'flex flex-col gap-8'}>
          <div>
            <h1 className={h1BaseStyle}>Gihun Ko Stephen</h1>
            <p className={microTextBaseStyle}>{t('intro')}</p>
            <NameCard variant="expanded" />
            <StatsBar stats={stats} className="mt-8" />
          </div>
          <div className={'flex flex-col w-full'}>
            <Section title={t('food_code')} id="food-code" background="white" className="px-0">
              <p className={'whitespace-pre-line font-light text-base leading-relaxed'}>
                {t.rich('food_code_desc', {
                  b: (chunks) => <span className={'font-bold'}>{chunks}</span>,
                  i: (chunks) => <span className={'italic'}>{chunks}</span>,
                })}
              </p>
            </Section>
            <Section
              title={t('about_project')}
              id="about-project"
              background="gray"
              className="rounded-lg"
            >
              <p className={'whitespace-pre-line font-light text-base leading-relaxed'}>
                {t('about_project_desc')}
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
