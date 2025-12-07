'use client';
import { baseLayoutStyle } from '@/app/constants/theme';
import { cn } from '@/app/utils';
import Close from '@mui/icons-material/Close';

export interface BannerProps {
  msg?: string;
}

export default function Banner({ msg }: BannerProps) {
  const onClose = () => {
    const bannerEl = document.getElementById('banner');
    bannerEl?.classList.toggle('hidden');
  };

  return (
    <div id="banner" className="flex bg-goldenmile justify-center font-medium text-xs">
      <div className={cn('flex grow py-0.5 justify-between items-center', baseLayoutStyle)}>
        {msg}
        <div onClick={onClose}>
          <Close fontSize={'small'} />
        </div>
      </div>
    </div>
  );
}
