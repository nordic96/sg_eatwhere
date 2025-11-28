"use client";
import { Suspense, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";

import TextureMap from "@/app/mapmodels/TextureMap";

import { FloatingMarker } from "../markers/FloatingMarker/FloatingMarker";
import { data } from "@/app/constants/data";
import { geoConverter } from "@/app/utils/geographyUtil";
import BuildingModel from "@/app/mapmodels/BuildingModel";
import dynamic from "next/dynamic";

const DynamicPortalLoader = dynamic(() => import("@/app/FullScreenLoader"), {
  ssr: false,
});

export default function MapScene() {
  const [ready, setReady] = useState(false);

  function dummyOnReady() {
    setTimeout(() => {
      setReady(true);
    }, 2000);
  }

  return (
    <>
      <Canvas camera={{ position: [0, 70, 8], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={1} />

          {/* The Map Plane */}
          <TextureMap />
          <BuildingModel
            position={[3, -0.01, 10]}
            scaleMultiplier={0.007}
            rotation={[0, Math.PI / 150, 0]}
            assetPath={"/models/singapore_map.glb"}
          />
          {/* Song Fa Bak Kut Teh Placeholder */}
          {data.map((val) => {
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
          {/* Camera controls */}
          <MapControls
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
            panSpeed={0.8}
            rotateSpeed={0.4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={10}
            maxDistance={80}
            zoomSpeed={0.6}
            enableDamping={true}
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
      {!ready && <DynamicPortalLoader onReady={dummyOnReady} />}
    </>
  );
}
