import { useTrailStore } from '@/app/stores';
import ToggleButton from '../ToggleButton/ToggleButton';
import { useTranslations } from 'next-intl';
import { cn } from '@/app/utils/cn';
import { FaCompass } from 'react-icons/fa';

export default function TrailMode() {
  const t = useTranslations('HomePage');
  const { trailMode, toggleTrailMode } = useTrailStore();
  return (
    <div className={'flex grow'}>
      <ToggleButton
        on={trailMode}
        onToggle={toggleTrailMode}
        className={'max-sm:flex-col max-sm:gap-3'}
        label={
          <div
            className={
              'flex gap-1 items-center bg-primary text-white py-1 px-2 rounded-full border border-[#333]'
            }
          >
            <span className="flex items-center gap-1">
              <FaCompass size={14} />
              <span>{t('trail_mode')}</span>
            </span>
            <div
              className={cn('w-2 h-2 rounded-full', trailMode ? 'bg-green-400' : 'bg-monsoongrey')}
            ></div>
          </div>
        }
      />
    </div>
  );
}
