import { h1BaseStyle, microTextBaseStyle } from '../../constants';
import FadeIn from '../../components/FadeIn/FadeIn';
import NameCard from '../../components/NameCard/NameCard';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CDN_BASE } from '@/app/config/cdn';

export default function Page() {
  const t = useTranslations('AboutPage');
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
              width={'500'}
              height={'500'}
              quality={'95'}
              src={`${CDN_BASE}/resources/images/about_me.png`}
            />
            <span className={'flex justify-center'}>{'-Illustration designed by Gihun Ko'}</span>
          </FadeIn>
        </div>
        <div className={'flex flex-col gap-16'}>
          <div>
            <h1 className={h1BaseStyle}>Gihun Ko Stephen</h1>
            <p className={microTextBaseStyle}>{t('intro')}</p>
            <NameCard />
          </div>
          <div className={'flex flex-col gap-8 w-[80%]'}>
            <div>
              <h3>{t('food_code')}</h3>
              <p className={'whitespace-pre-line font-light text-base'}>
                {t.rich('food_code_desc', {
                  b: (chunks) => <span className={'font-bold'}>{chunks}</span>,
                  i: (chunks) => <span className={'italic'}>{chunks}</span>,
                })}
              </p>
            </div>
            <div>
              <h3>{t('about_project')}</h3>
              <p className={'whitespace-pre-line font-light text-base'}>
                {t('about_project_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
