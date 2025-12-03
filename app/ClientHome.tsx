'use client';

import FilterBar from './components/FilterBar/FilterBar';
import MapScene from './components/MapScene/MapScene';
import Sidebar from './components/Sidebar/Sidebar';
import withSuspense from './functions/withSuspense';
import HeritageListView from './components/HeritageListView/HeritageListView';
import { useTranslations } from 'next-intl';

const MAP_COPYRIGHT_URL =
  'Seloloving, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons';
function ClientHome({ locale, messages }: { locale: string; messages: Record<string, string> }) {
  const t = useTranslations('HomePage');
  return (
    <div className={'relative flex flex-col grow overflow-hiden pb-8'}>
      <FilterBar />
      <div className="h-[75vh] max-h-[800px]">
        <MapScene locale={locale} messages={messages} />
      </div>
      <Sidebar />
      <a
        className="italic hover:text-primary"
        href={'https://commons.wikimedia.org/wiki/File:Singapore_MRT_Network_(with_Hume).svg'}
        target={'_blank'}
      >
        {`${t('map_by')} ${MAP_COPYRIGHT_URL}`}
      </a>
      <p className="italic text-[#333]">{t('map_disclaimer')}</p>
      <div className="flex grow justify-between mt-8">
        {/** Food List Container */}
        <div className="grid grid-cols-4 w-[60%]">
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
