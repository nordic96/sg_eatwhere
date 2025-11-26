"use client";

import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import MBSPlaceholder from "@/app/mapmodels/MBSPlaceholder";
import River from "@/app/mapmodels/River";

const RIVER_POINTS: Array<[number, number]> = [
  [-6, 6],
  [-4, 4],
  [-2, 2],
  [0, 0],
  [2, -1],
  [4, -2],
];
export default function MapScene() {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* The Map Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 1, 1]} />
        <meshStandardMaterial color={"#d9d9d9"} />
      </mesh>

      <MBSPlaceholder position={[0, 0, 0]} />
      {/* Song Fa Bak Kut Teh Placeholder */}
      <mesh position={[-16, 0, 4.1]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={["#c44"]} />
      </mesh>
      <River points={RIVER_POINTS} width={1.8} flowSpeed={0.05} position={[0, 0.02, 0]} />
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
        maxDistance={50}
        zoomSpeed={0.6}
        enableDamping={true}
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
