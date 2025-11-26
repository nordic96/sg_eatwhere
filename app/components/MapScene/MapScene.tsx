"use client";
import { Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";

import TextureMap from "@/app/mapmodels/TextureMap";
// import MBSPlaceholder from "@/app/mapmodels/MBSPlaceholder";
import MBSModel from "@/app/mapmodels/MBSModel";
import { openSidebar } from "../Sidebar/Sidebar";

export default function MapScene() {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
      <Suspense>
        {/* Lighting */}
        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        {/* The Map Plane */}
        <TextureMap />

        {/* <MBSPlaceholder position={[7.2, 0, 17]} /> */}
        <MBSModel position={[9.2, 0.3, 17]} />
        {/* Song Fa Bak Kut Teh Placeholder */}
        <mesh
          position={[2, 0, 13.1]}
          onClick={() => {
            openSidebar();
          }}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={["#c44"]} />
        </mesh>
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
          maxDistance={250}
          zoomSpeed={0.6}
          enableDamping={true}
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
