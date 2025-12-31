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
import SearchBar from '@/app/components/SearchBar/SearchBar';
import FoodMarquee from '../../components/FoodMarquee/FoodMarquee';
import { LocationPin } from '@mui/icons-material';
import GoogleMapsBanner from '@/app/components/GoogleMapsBanner/GoogleMapsBanner';

type ClientHomeProps = {
  locale: string;
  messages: Record<string, string>;
  foods: FoodHeritage[];
  trailMode?: boolean;
  gmapUrl: string | undefined;
};

const MAP_COPYRIGHT_URL =
  'Seloloving, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons';
function ClientHome({ trailMode, foods, locale, messages, gmapUrl }: ClientHomeProps) {
  const { setFoodData, reset } = useHeritageStore();
  const getFoodImages = useHeritageStore((state) => state.getFoodImages);
  const foodImages = getFoodImages();
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
      {/** Search Bar */}
      <div className={'h-10 py-0.5 flex items-center'}>
        <SearchBar />
      </div>
      {/** Map Filters */}
      <div className={'absolute flex w-full justify-between items-center top-10 z-100'}>
        <Activity mode={trailMode ? 'visible' : 'hidden'}>
          <TrailMode />
        </Activity>
        <FilterBar />
      </div>
      {/** Map Content */}
      <div className="relative h-[75vh] max-h-[800px] overflow-y-hidden select-none">
        <MapScene locale={locale} messages={messages} />
      </div>
      <Sidebar />
      <a
        className="italic hover:text-primary w-fit"
        href={'https://commons.wikimedia.org/wiki/File:Singapore_MRT_Network_(with_Hume).svg'}
        target={'_blank'}
        rel="noopener noreferrer"
        aria-label="Map attribution: Seloloving, licensed under CC BY-SA 4.0 on Wikimedia Commons"
      >
        {`${t('map_by')} ${MAP_COPYRIGHT_URL}`}
      </a>
      <p className="italic text-[#333]">{t('map_disclaimer')}</p>
      <div className="flex flex-col grow justify-between mt-8 gap-8">
        {/** Gmap List Container */}
        <div className={'flex flex-1'}>
          {/** Food Macquee Container */}
          <FoodMarquee items={foodImages} />
        </div>
        <GoogleMapsBanner url={gmapUrl} />
        {/** Food List Container */}
        <div className={'flex flex-col'}>
          <div className={'flex items-center'}>
            <LocationPin fontSize={'medium'} aria-hidden="true" />
            <h2 className={'font-bold text-lg'}>{t('foodlist_by_region')}</h2>
          </div>
          <div className="grid grid-cols-4 flex-1 mt-1">
            <HeritageListView region={'central'} />
            <HeritageListView region={'east'} />
            <HeritageListView region={'west'} />
            <HeritageListView region={'north'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withSuspense(ClientHome, <p>Loading...</p>);
