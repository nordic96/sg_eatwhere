"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

type MBSModelProps = ThreeElements["group"] & {
  scaleMultiplier?: number;
};

export default function MBSModel({ scaleMultiplier = 0.4, ...props }: MBSModelProps) {
  const group = useRef<THREE.Group>(null);

  // Load GLTF
  const { scene } = useGLTF("/models/marina_bay_singapore.glb");

  return (
    <group
      ref={group}
      {...props}
      scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}
      rotation={[0, Math.PI / 1.2, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

// Required so drei does not try to preload everything blindly
useGLTF.preload("/models/marina_bay_singapore.glb");
