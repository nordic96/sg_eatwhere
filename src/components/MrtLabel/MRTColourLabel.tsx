import { MRT_LABEL_DISPLAY_LANG } from '@/config';
import { mrtLabelMap } from '@/constants';
import { mrtColourStyle } from '@/styles';
import { cn } from '@/utils';
import { useLocale, useTranslations } from 'next-intl';

export default function MRTColourLabel({ code }: { code: string }) {
  const locale = useLocale();
  const mrtT = useTranslations('MRT');
  if (code.length <= 0) {
    return null;
  }
  const mrts = code.trim().split('/');
  return (
    <div className={'flex items-center gap-1'}>
      {/** MRT Colour Bar */}
      <div className={'flex rounded-l-lg rounded-r-lg overflow-hidden'}>
        {mrts.map((mrt, i) => {
          const lineCode = mrt.substring(0, 2);
          const colourStyle = mrtColourStyle(lineCode);
          return (
            <div
              key={`${lineCode}-${i}`}
              className={cn(colourStyle, {
                'w-3 h-3': mrts.length === 1,
                'w-2.5 h-3': mrts.length === 2,
                'w-2 h-3': mrts.length > 2,
              })}
            >
              &nbsp;
            </div>
          );
        })}
      </div>
      {/** MRT Name Container */}
      <span className={'text-xs'}>
        {mrtLabelMap[mrts[0]]}
        {MRT_LABEL_DISPLAY_LANG.includes(locale) ? ` (${mrtT(mrts[0])})` : undefined}
      </span>
    </div>
  );
}
