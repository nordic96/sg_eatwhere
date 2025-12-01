"use client";
import { Suspense, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Cloud, MapControls, Sky, Stars } from "@react-three/drei";

import TextureMap from "@/app/mapmodels/TextureMap";

import { FloatingMarker } from "../markers/FloatingMarker/FloatingMarker";
import { data } from "@/app/constants/data";
import { geoConverter } from "@/app/utils/geographyUtil";
import dynamic from "next/dynamic";
import { useHeritageStore } from "@/app/stores";

const DynamicPortalLoader = dynamic(() => import("@/app/FullScreenLoader"), {
  ssr: false,
});

export default function MapScene() {
  const [ready, setReady] = useState(false);
  const { filter } = useHeritageStore();

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
          <ambientLight intensity={2.5} />
          {/* The Cloud component can effectively act as a cloud plane or environment */}
          <Sky
            distance={4500}
            sunPosition={[20, 10, -20]}
            inclination={0}
            azimuth={0.25}
            mieDirectionalG={0.01}
          />

          {/* Optional: Add basic lighting or a black background */}
          {/* <color attach="background" args={["#000000"]} /> */}

          {/* Drei Stars component */}
          <Stars
            radius={100} // Sphere radius the stars are distributed on
            depth={50} // Depth of the stars (distance from camera)
            count={5000} // Number of stars
            factor={4} // Size factor of the stars
            saturation={0} // Saturation level (0 = white stars)
            fade={true} // Fades stars in and out
            speed={1} // Speed of the slight animation/movement
          />
          {/* The Map Plane */}
          <TextureMap />
          {/* Song Fa Bak Kut Teh Placeholder */}
          {data
            .filter((v) => {
              if (filter.length === 0) {
                return true;
              }
              return filter.includes(v.category);
            })
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
