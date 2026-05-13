import Image from 'next/image';
import Tooltip from '../Tooltip/Tooltip';
import { useTranslations } from 'next-intl';

export default function SpicyIcon({ label }: { label?: boolean }) {
  const t = useTranslations('Spicy');
  return (
    <div className={'flex items-center gap-0.5'}>
      <div className={'w-4 h-4 rounded-full bg-white items-center justify-center'}>
        <Image
          alt={'spicy'}
          src={'/images/spicy.svg'}
          width={'0'}
          height={'0'}
          className={'w-4 h-4'}
        />
      </div>
      {label && (
        <Tooltip direction={'left'} content={t('tooltip_desc')} className={'w-22'}>
          <span>{t('label')}</span>
        </Tooltip>
      )}
    </div>
  );
}
