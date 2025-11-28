"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

type BuildingModelProps = ThreeElements["group"] & {
  scaleMultiplier?: number;
  assetPath: string;
};

export default function BuildingModel({ scaleMultiplier = 0.4, ...props }: BuildingModelProps) {
  const { assetPath } = props;
  const group = useRef<THREE.Group>(null);

  // Load GLTF
  const { scene } = useGLTF(assetPath);

  return (
    <group ref={group} {...props} scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}>
      <primitive object={scene} />
    </group>
  );
}
