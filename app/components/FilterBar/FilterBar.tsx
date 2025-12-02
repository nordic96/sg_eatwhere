'use client';

import Image from 'next/image';
import roosterBowl from '@/public/images/rooter_bowl.svg';
import hawkerBowl from '@/public/images/hawker_bowl.svg';

import { useHeritageStore } from '@/app/stores';
import { EateryCategory, EateryCategoryValues } from '@/app/types';
import { useEffect } from 'react';
import { cn } from '@/app/utils';

type ToggleFuncMap = Record<EateryCategory, (bool?: boolean) => void>;

interface FilterBarProps {
  labels: Record<EateryCategory, string>;
}

export default function FilterBar({ labels }: FilterBarProps) {
  const { filter, setFilter, unsetFilter } = useHeritageStore();

  const onSelectFilter = (id: EateryCategory) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (filter.includes(id)) {
      unsetFilter(id);
      return;
    }
    setFilter(id);
  };

  function activateHawker(activate = true) {
    const el = document.getElementById('filter_label_hawker');
    if (activate) {
      el?.classList.add('bg-primary', 'text-white');
      el?.classList.remove('hover:text-primary');
    } else {
      el?.classList.remove('bg-primary', 'text-white');
      el?.classList.add('hover:text-primary');
    }
  }

  function activateRestaurant(activate = true) {
    const el = document.getElementById('filter_label_restaurant');
    if (activate) {
      el?.classList.add('bg-merlionwhite');
      el?.classList.remove('hover:text-monsoongrey');
    } else {
      el?.classList.remove('bg-merlionwhite');
      el?.classList.add('hover:text-monsoongrey');
    }
  }

  function activateDessert(activate = true) {
    const el = document.getElementById('filter_label_dessert');
    if (activate) {
      el?.classList.add('bg-gardengreen', 'text-white');
    } else {
      el?.classList.remove('bg-gardengreen', 'text-white');
    }
  }

  useEffect(() => {
    const toggleFuncMap: ToggleFuncMap = {
      hawker: activateHawker,
      restaurant: activateRestaurant,
      dessert: activateDessert,
    };
    EateryCategoryValues.forEach((cat) => {
      if (filter.includes(cat)) {
        toggleFuncMap[cat]();
      }
    });

    return () => {
      activateHawker(false);
      activateRestaurant(false);
      activateDessert(false);
    };
  }, [filter]);

  const labelBaseStyle =
    'rounded-xl px-2 py-1 shadow-lg font-regular border-[0.5px] hover:cursor-pointer';
  return (
    <div>
      <div className="py-2 flex gap-2">
        <div className="flex items-center gap-2 text-xs">
          <Image src={hawkerBowl} height={35} width={50} alt={'hawker_bowl'} />
          <div
            id={'filter_label_hawker'}
            onClick={onSelectFilter('hawker')}
            className={cn(labelBaseStyle, 'hover:text-primary hover:cursor-pointer')}
          >
            <p>{labels.hawker}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image src={roosterBowl} height={35} width={50} alt={'hawker_bowl'} />
          <div
            id={'filter_label_restaurant'}
            onClick={onSelectFilter('restaurant')}
            className={labelBaseStyle}
          >
            <p>{labels.restaurant}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image src={roosterBowl} height={35} width={50} alt={'hawker_bowl'} />
          <div
            id={'filter_label_dessert'}
            onClick={onSelectFilter('dessert')}
            className={labelBaseStyle}
          >
            <p>{labels.dessert}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
