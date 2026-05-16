import { FOODTAGS } from '@/types';
import { FoodTagIcon } from '.';

export default function FoodTagLegend() {
  return (
    <div className={'flex gap-0.5 px-2 items-center border border-[#333] rounded-full'}>
      {FOODTAGS.map((tag, i) => {
        return (
          <div key={`foodtag-legend-${tag}-${i}`} className={'p-1 rounded-full'}>
            <FoodTagIcon tagType={tag} showLabel showTooltip />
          </div>
        );
      })}
    </div>
  );
}
