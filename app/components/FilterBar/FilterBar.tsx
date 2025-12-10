'use client';
import { useHeritageStore } from '@/app/stores';
import { EateryCategory, EateryCategoryValues } from '@/app/types';
import { MouseEventHandler, useEffect } from 'react';
import { cn } from '@/app/utils';
import { useTranslations } from 'next-intl';
import HelpTooltip from '../Tooltip/HelpTooltip';
import CategoryIcon from '../CategoryIcon/CategoryIcon';

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
        <Filter category={'dessert'} onSelect={onSelectFilter('dessert')} />
      </div>
    </div>
  );
}

type FilterProps = {
  category: EateryCategory;
  onSelect: MouseEventHandler<HTMLDivElement>;
  tooltipKey?: string;
  customIconClass?: string;
};

function Filter({ category, onSelect, tooltipKey, customIconClass }: FilterProps) {
  const t = useTranslations('FilterBar');
  const labelBaseStyle =
    'rounded-xl px-2 py-1 shadow-lg font-regular border-[0.5px] hover:cursor-pointer flex items-center gap-1';
  return (
    <div className="flex items-center gap-2 text-xs">
      <CategoryIcon cat={category} alt={'filter_icon'} className={customIconClass} />
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
