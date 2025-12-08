'use client';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { Billboard, Html, MapControls } from '@react-three/drei';
import MapEnvironment from '@/app/mapmodels/MapEnvironment';

import { useHeritageStore } from '@/app/stores';

import CloseButton from '../CloseButton/CloseButton';
import PlaceContent from '../PlaceContent/PlaceContent';
import CanvasIntlProvider from '../CanvasIntlProvider';
import FoodBlock from '@/app/mapmodels/FoodBlock';

const DynamicPortalLoader = dynamic(() => import('@/app/FullScreenLoader'), {
  ssr: false,
});

type Props = {
  messages: Record<string, string>;
  locale?: string;
};

export default function MapScene({ messages, locale = 'en' }: Props) {
  const [ready, setReady] = useState(false);
  const { heritageId, filter, unSelect, clickedMore, getThemeStyle, getFoodData } =
    useHeritageStore();

  function dummyOnReady() {
    setTimeout(() => setReady(true), 1000);
  }

  return (
    <>
      <Canvas camera={{ position: [0, 70, 8], fov: 45 }} onClick={(e) => e.stopPropagation()}>
        <Suspense fallback={null}>
          <MapEnvironment />
          {heritageId && !clickedMore && (
            <Billboard position={[10, 15, 0]}>
              <Html>
                <CanvasIntlProvider messages={messages} locale={locale}>
                  <div
                    className={'flex flex-col items-end w-[384px] rounded-xl bg-white p-4 gap-2'}
                  >
                    <CloseButton onClick={unSelect} customClass={getThemeStyle()} />
                    <PlaceContent />
                  </div>
                </CanvasIntlProvider>
              </Html>
            </Billboard>
          )}
          {/* --- Markers --- */}
          {getFoodData()
            .filter((v) => filter.length === 0 || filter.includes(v.category))
            .map((val) => {
              return <FoodBlock key={val.id} data={val} />;
            })}

          {/* --- Camera Controls --- */}
          <MapControls
            enableRotate
            enablePan
            enableZoom
            panSpeed={0.8}
            rotateSpeed={0.4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={10}
            maxDistance={80}
            zoomSpeed={0.6}
            enableDamping
            makeDefault
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>

      {!ready && <DynamicPortalLoader onReady={dummyOnReady} />}
    </>
  );
}
