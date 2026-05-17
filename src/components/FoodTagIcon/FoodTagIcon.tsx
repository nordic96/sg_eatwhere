import Image from 'next/image';
import { FoodTag } from '@/types';
import { useTranslations } from 'next-intl';
import Tooltip from '../Tooltip/Tooltip';

export default function TagIcon({
  tagType,
  showLabel = false,
  showTooltip = true,
}: {
  tagType: FoodTag;
  showLabel?: boolean;
  showTooltip?: boolean;
}) {
  const t = useTranslations('TagIcon');
  return (
    <div className={'flex items-center gap-0.5'}>
      {showTooltip ? (
        <Tooltip direction={'left'} content={t(`${tagType}_tooltip`)} className={'w-25'}>
          <div className={'w-4 h-4 rounded-full bg-white items-center justify-center'}>
            <Image
              alt={'foodtag-icon'}
              src={`/images/${tagType}.svg`}
              width={'0'}
              height={'0'}
              className={'w-4 h-4'}
            />
          </div>
        </Tooltip>
      ) : (
        <div className={'w-4 h-4 rounded-full bg-white items-center justify-center'}>
          <Image
            alt={'foodtag-icon'}
            src={`/images/${tagType}.svg`}
            width={'0'}
            height={'0'}
            className={'w-4 h-4'}
          />
        </div>
      )}
      {showLabel && <span>{t(tagType)}</span>}
    </div>
  );
}
