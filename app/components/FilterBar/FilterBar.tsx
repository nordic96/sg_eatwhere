'use client';
import { useAppStore, useHeritageStore } from '@/app/stores';
import { EateryCategory } from '@/app/types';
import { MouseEventHandler, useCallback } from 'react';
import { cn } from '@/app/utils';
import { useTranslations } from 'next-intl';
import HelpTooltip from '../Tooltip/HelpTooltip';
import CategoryIcon from '../CategoryIcon/CategoryIcon';

export default function FilterBar() {
  const { closeMore } = useAppStore();
  const { filter, setFilter, unsetFilter, unSelect } = useHeritageStore();

  const onSelectFilter = useCallback(
    (id: EateryCategory) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (filter.includes(id)) {
        unsetFilter(id);
        unSelect();
        closeMore();
        return;
      }
      setFilter(id);
    },
    [filter, setFilter, unsetFilter, unSelect, closeMore],
  );

  return (
    <div>
      <div className="py-2 flex gap-2">
        <Filter
          category={'hawker'}
          isActive={filter.includes('hawker')}
          onSelect={onSelectFilter('hawker')}
          tooltipKey={'what_is_hawker'}
        />
        <Filter
          category={'restaurant'}
          isActive={filter.includes('restaurant')}
          onSelect={onSelectFilter('restaurant')}
        />
        <Filter
          category={'dessert'}
          isActive={filter.includes('dessert')}
          onSelect={onSelectFilter('dessert')}
        />
      </div>
    </div>
  );
}

type FilterProps = {
  category: EateryCategory;
  isActive: boolean;
  onSelect: MouseEventHandler<HTMLDivElement>;
  tooltipKey?: string;
  customIconClass?: string;
};

function Filter({ category, isActive, onSelect, tooltipKey, customIconClass }: FilterProps) {
  const t = useTranslations('FilterBar');
  const labelBaseStyle =
    'rounded-xl px-2 py-1 shadow-lg font-regular border border-[#333] hover:cursor-pointer flex items-center gap-1';

  const activeStyles = {
    hawker: isActive ? 'bg-primary text-white' : 'hover:text-primary',
    restaurant: isActive ? 'bg-outramorange text-white' : 'hover:text-outramorange',
    dessert: isActive ? 'bg-gardengreen text-white' : 'hover:text-gardengreen',
  };

  return (
    <div className="flex max-sm:flex-col items-center gap-2 text-xs">
      <CategoryIcon cat={category} alt={'filter_icon'} className={customIconClass} />
      <div className={cn(labelBaseStyle, 'hover:cursor-pointer', activeStyles[category])}>
        <div onClick={onSelect}>{t(category)}</div>
        {tooltipKey !== undefined && (
          <HelpTooltip
            direction={'middle'}
            msgKey={tooltipKey || ''}
            iconProps={{ fontSize: 'inherit' }}
            className={'min-w-[250px]'}
          />
        )}
      </div>
    </div>
  );
}
