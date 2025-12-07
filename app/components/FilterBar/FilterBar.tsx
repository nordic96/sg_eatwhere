'use client';

import Image from 'next/image';
import roosterBowl from '@/public/images/rooter_bowl.svg';
import hawkerBowl from '@/public/images/hawker_bowl.svg';

import { useHeritageStore } from '@/app/stores';
import { EateryCategory, EateryCategoryValues } from '@/app/types';
import { useEffect } from 'react';
import { cn } from '@/app/utils';
import { useTranslations } from 'next-intl';

type ToggleFuncMap = Record<EateryCategory, (bool?: boolean) => void>;

export default function FilterBar() {
  const t = useTranslations('FilterBar');
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

  const labelBaseStyle =
    'rounded-xl px-2 py-1 shadow-lg font-regular border-[0.5px] hover:cursor-pointer';
  return (
    <div>
      <div className="py-2 flex gap-2">
        <div className="flex items-center gap-2 text-xs">
          <Image
            src={hawkerBowl}
            className={'w-12 max-sm:w-10'}
            height={'0'}
            width={'0'}
            alt={'hawker_bowl'}
          />
          <div
            id={'filter_label_hawker'}
            onClick={onSelectFilter('hawker')}
            className={cn(labelBaseStyle, 'hover:text-primary hover:cursor-pointer')}
          >
            <p>{t('hawker')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={roosterBowl}
            className={'w-12 max-sm:w-10'}
            height={'0'}
            width={'0'}
            alt={'restaurant_bowl'}
          />
          <div
            id={'filter_label_restaurant'}
            onClick={onSelectFilter('restaurant')}
            className={labelBaseStyle}
          >
            <p>{t('restaurant')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={roosterBowl}
            className={'w-12 max-sm:w-10'}
            height={'0'}
            width={'0'}
            alt={'dessert_filter'}
          />
          <div
            id={'filter_label_dessert'}
            onClick={onSelectFilter('dessert')}
            className={labelBaseStyle}
          >
            <p>{t('dessert')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
