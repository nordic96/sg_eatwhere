"use client";
import { Suspense, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";

import { FloatingMarker } from "../markers/FloatingMarker/FloatingMarker";
import { data } from "@/app/constants/data";
import { geoConverter } from "@/app/utils/geographyUtil";
import dynamic from "next/dynamic";
import { useHeritageStore } from "@/app/stores";
import MapEnvironment from "@/app/mapmodels/MapEnvironment";

const DynamicPortalLoader = dynamic(() => import("@/app/FullScreenLoader"), {
  ssr: false,
});

export default function MapScene() {
  const [ready, setReady] = useState(false);
  const { filter } = useHeritageStore();
  function dummyOnReady() {
    setTimeout(() => setReady(true), 2000);
  }

  return (
    <>
      <Canvas camera={{ position: [0, 70, 8], fov: 45 }} onClick={(e) => e.stopPropagation()}>
        <Suspense fallback={null}>
          <MapEnvironment />
          {/* --- Markers --- */}
          {data
            .filter((v) => filter.length === 0 || filter.includes(v.category))
            .map((val) => {
              return (
                <FloatingMarker
                  key={val.id}
                  position={geoConverter(val.location.geoLocation)}
                  floatHeight={5}
                  data={val}
                >
                  <mesh>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color={["#c44"]} />
                  </mesh>
                </FloatingMarker>
              );
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
