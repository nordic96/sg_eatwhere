'use client';
import { baseLayoutStyle } from '@/app/constants/theme';
import { cn } from '@/app/utils';
import Close from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';

export interface BannerProps {
  msg?: string;
}

export default function Banner({ msg = '' }: BannerProps) {
  const t = useTranslations('Banner');
  const onClose = () => {
    const bannerEl = document.getElementById('banner');
    bannerEl?.classList.toggle('hidden');
  };

  return (
    <div
      id="banner"
      role="banner"
      aria-label="Notification banner"
      className="flex bg-goldenmile justify-center font-medium text-xs"
    >
      <div className={cn('flex grow py-0.5 justify-between items-center', baseLayoutStyle)}>
        {t(msg)}
        <button onClick={onClose} aria-label="Close banner" className="cursor-pointer">
          <Close fontSize={'small'} />
        </button>
      </div>
    </div>
  );
}
