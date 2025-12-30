import CategoryIcon from '@/app/components/CategoryIcon/CategoryIcon';
import { useHeritageStore } from '@/app/stores';
import { shuffle } from '@/app/utils';
import { SubwayOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export type FoodMarqueeItem = {
  src: string;
  id: string;
};

interface FoodMarqueeProps {
  items: FoodMarqueeItem[];
  shuffleArr?: boolean;
}
export default function FoodMarquee({ items, shuffleArr = true }: FoodMarqueeProps) {
  function generateImages(keyPrefix: string) {
    let arr = items;
    if (shuffleArr) {
      arr = shuffle(arr);
    }
    return arr.map(({ src, id }, i) => {
      return <FoodMarqueeItemComp key={`${keyPrefix}-${i}`} src={src} id={id} index={i} />;
    });
  }

  return (
    <div className="absolute flex overflow-hidden group bg-[#333]">
      <div className="flex animate-food-marquee gap-1 group-hover:[animation-play-state:paused]">
        {generateImages('set1')}
      </div>
      <div className="ml-1 flex animate-food-marquee gap-1 group-hover:[animation-play-state:paused]">
        {generateImages('set2')}
      </div>
    </div>
  );
}

function FoodMarqueeItemComp({ src, id, index }: FoodMarqueeItem & { index: number }) {
  const mrtT = useTranslations('MRT');

  const setHeritageId = useHeritageStore((state) => state.setHeritageId);
  const getFoodDataById = useHeritageStore((state) => state.getFoodDataById);
  const data = getFoodDataById(id);
  if (data === null) {
    return null;
  }
  return (
    <div
      className={'relative cursor-pointer w-40 h-40 shrink-0 transition-transform hover:scale-105'}
      onClick={() => setHeritageId(id)}
    >
      <Image
        className={'object-cover w-full h-full rounded-sm'}
        priority={index < 5}
        alt={`Food Heritage ${id}`}
        src={src}
        width={160}
        height={160}
        quality={90}
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 to-transparent"></div>
      <div className={'absolute flex flex-col text-white bottom-2 w-full px-2 text-left'}>
        <CategoryIcon alt={'category'} cat={data.category} />
        <span className={'font-extrabold text-xs'}>{data.name}</span>
        <div className={'flex text-xs'}>
          <div>
            <SubwayOutlined fontSize={'inherit'} />
            <span>{mrtT(data.location.mrt[0])}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
