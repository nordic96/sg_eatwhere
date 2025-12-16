'use client';
import dynamic from 'next/dynamic';
import { Activity, Suspense, useRef, useState } from 'react';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Billboard, Html, MapControls } from '@react-three/drei';
import { MapControls as MapControlsImpl } from 'three-stdlib';
import MapEnvironment from '@/app/mapmodels/MapEnvironment';

import { useAppStore, useHeritageStore, useTrailStore } from '@/app/stores';

import PlaceContent from '../PlaceContent/PlaceContent';
import CanvasIntlProvider from '../CanvasIntlProvider';
import { InstancedBuildings } from '@/app/mapmodels/InstancedBuildings';
import GlowInstances from '@/app/mapmodels/GlowInstances';
import { useEnvironmentStore } from '@/app/stores/useEnvironmentStore';
import LocationPin from '@/app/mapmodels/LocationPin';
import MapController from '../MapController/MapController';
import TrailPath from '@/app/mapmodels/TrailPath';

const DynamicPortalLoader = dynamic(() => import('@/app/FullScreenLoader'), {
  ssr: false,
});

type Props = {
  messages: Record<string, string>;
  locale?: string;
};

export default function MapScene({ messages, locale = 'en' }: Props) {
  const controllerRef = useRef<MapControlsImpl>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const [ready, setReady] = useState(false);
  const { isNight } = useEnvironmentStore();
  const clickedMore = useAppStore((state) => state.clickedMore);
  const trailMode = useTrailStore((state) => state.trailMode);
  const { heritageId, foodData } = useHeritageStore();

  return (
    <>
      <Canvas
        className={'border border-[#333]'}
        camera={{ position: [0, 70, 8], fov: 45 }}
        onClick={(e) => e.stopPropagation()}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <Suspense fallback={null}>
          <MapEnvironment />
          {heritageId && !clickedMore && (
            <Billboard position={[10, 15, 0]}>
              <Html>
                <CanvasIntlProvider messages={messages} locale={locale}>
                  <PlaceContent />
                </CanvasIntlProvider>
              </Html>
            </Billboard>
          )}
          {/** Location Pin Logic */}
          <LocationPin />
          {/* --- Markers --- */}
          <InstancedBuildings locations={foodData} />
          {/** Trail Lines (Curved) */}
          {trailMode && <TrailPath />}
          <GlowInstances buildings={foodData} isNight={isNight} />
          {/* --- Camera Controls --- */}
          <MapControls
            ref={controllerRef}
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
            dampingFactor={0.08}
            makeDefault
          />
        </Suspense>
      </Canvas>
      <Activity mode={!ready ? 'visible' : 'hidden'}>
        <DynamicPortalLoader onReady={() => setReady(true)} />
      </Activity>
      <div className="absolute bottom-0 right-0 z-90">
        {/** Map Controller UI, not wired with control logic */}
        <MapController controls={controllerRef} camera={cameraRef} />
      </div>
    </>
  );
}
