import { mrtLabelMap } from '@/constants';
import { mrtColourStyle } from '@/styles';
import { cn } from '@/utils';

export function parseMrtCodes(code: string) {
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
      <span className={'text-xs'}>{mrtLabelMap[mrts[0]]}</span>
    </div>
  );
}
