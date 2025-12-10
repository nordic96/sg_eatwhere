'use client';

import Image from 'next/image';

import roosterBowl from '@/public/images/rooter_bowl.svg';
import hawkerBowl from '@/public/images/hawker_bowl.svg';
import chendol from '@/public/images/chendol.svg';

import { useHeritageStore } from '@/app/stores';
import { EateryCategory, EateryCategoryValues } from '@/app/types';
import { MouseEventHandler, useEffect } from 'react';
import { cn } from '@/app/utils';
import { useTranslations } from 'next-intl';
import HelpTooltip from '../Tooltip/HelpTooltip';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ClassValue } from 'clsx';

type ToggleFuncMap = Record<EateryCategory, (bool?: boolean) => void>;

export default function FilterBar() {
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
      el?.classList.add('bg-outramorange', 'text-white');
      el?.classList.remove('hover:text-outramorange');
    } else {
      el?.classList.remove('bg-outramorange', 'text-white');
      el?.classList.add('hover:text-outramorange');
    }
  }

  function activateDessert(activate = true) {
    const el = document.getElementById('filter_label_dessert');
    if (activate) {
      el?.classList.add('bg-gardengreen', 'text-white');
      el?.classList.remove('hover:text-gardengreen');
    } else {
      el?.classList.remove('bg-gardengreen', 'text-white');
      el?.classList.add('hover:text-gardengreen');
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

  return (
    <div>
      <div className="py-2 flex gap-2">
        <Filter
          category={'hawker'}
          onSelect={onSelectFilter('hawker')}
          tooltipKey={'what_is_hawker'}
        />
        <Filter category={'restaurant'} onSelect={onSelectFilter('restaurant')} />
        <Filter
          category={'dessert'}
          onSelect={onSelectFilter('dessert')}
          customIconClass={'h-5 max-sm:h-7'}
        />
      </div>
    </div>
  );
}

const IconMap: Record<EateryCategory, StaticImport> = {
  dessert: chendol,
  restaurant: roosterBowl,
  hawker: hawkerBowl,
};

type FilterProps = {
  category: EateryCategory;
  onSelect: MouseEventHandler<HTMLDivElement>;
  tooltipKey?: string;
  customIconClass?: string | ClassValue;
};

function Filter({ category, onSelect, tooltipKey, customIconClass }: FilterProps) {
  const t = useTranslations('FilterBar');
  const iconContainerStyle = 'w-10 rounded-4xl bg-white p-1';
  const labelBaseStyle =
    'rounded-xl px-2 py-1 shadow-lg font-regular border-[0.5px] hover:cursor-pointer flex items-center gap-1';
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={cn(iconContainerStyle)}>
        <Image
          src={IconMap[category]}
          className={cn('w-9 max-sm:w-10', customIconClass)}
          height={'0'}
          width={'0'}
          alt={'filter_icon'}
        />
      </div>
      <div
        id={`filter_label_${category}`}
        className={cn(labelBaseStyle, 'hover:cursor-pointer', {
          'hover:text-primary': category === 'hawker',
          'hover:text-gardengreen': category === 'dessert',
          'hover:text-outramorange': category === 'restaurant',
        })}
      >
        <div onClick={onSelect}>{t(category)}</div>
        {tooltipKey !== undefined && (
          <HelpTooltip
            msgKey={tooltipKey || ''}
            iconProps={{ fontSize: 'inherit' }}
            className={'min-w-[250px]'}
          />
        )}
      </div>
    </div>
  );
}
