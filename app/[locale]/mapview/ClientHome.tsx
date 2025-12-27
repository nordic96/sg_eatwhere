'use client';

import FilterBar from '../../components/FilterBar/FilterBar';
import MapScene from '../../components/MapScene/MapScene';
import Sidebar from '../../components/Sidebar/Sidebar';
import withSuspense from '../../functions/withSuspense';
import HeritageListView from '../../components/HeritageListView/HeritageListView';
import { useTranslations } from 'next-intl';
import { FoodHeritage } from '../../types';
import { useHeritageStore } from '../../stores';
import { Activity, useEffect } from 'react';
import TrailMode from '../../components/TrailMode/TrailMode';

type ClientHomeProps = {
  locale: string;
  messages: Record<string, string>;
  foods: FoodHeritage[];
  trailMode?: boolean;
};

const MAP_COPYRIGHT_URL =
  'Seloloving, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons';
function ClientHome({ trailMode, foods, locale, messages }: ClientHomeProps) {
  const { setFoodData, reset } = useHeritageStore();
  const t = useTranslations('HomePage');

  useEffect(() => {
    setFoodData(foods);
  }, [foods, setFoodData]);

  useEffect(() => {
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={'relative flex flex-col grow pb-8'}>
      <div className={'absolute flex w-full justify-between items-center top-0 z-100'}>
        <Activity mode={trailMode ? 'visible' : 'hidden'}>
          <TrailMode />
        </Activity>
        <FilterBar />
      </div>
      <div className="relative h-[75vh] max-h-[800px] overflow-y-hidden select-none">
        <MapScene locale={locale} messages={messages} />
      </div>
      <Sidebar />
      <a
        className="italic hover:text-primary w-fit"
        href={'https://commons.wikimedia.org/wiki/File:Singapore_MRT_Network_(with_Hume).svg'}
        target={'_blank'}
      >
        {`${t('map_by')} ${MAP_COPYRIGHT_URL}`}
      </a>
      <p className="italic text-[#333]">{t('map_disclaimer')}</p>
      <div className="flex grow justify-between mt-8">
        {/** Food List Container */}
        <div className="grid grid-cols-4 w-[60%] max-sm:w-full max-sm:grid-cols-1 max-sm:gap-4">
          <HeritageListView region={'central'} />
          <HeritageListView region={'east'} />
          <HeritageListView region={'west'} />
          <HeritageListView region={'north'} />
        </div>
        {/** Gmap List Container */}
        <div></div>
      </div>
    </div>
  );
}

export default withSuspense(ClientHome, <p>Loading...</p>);
