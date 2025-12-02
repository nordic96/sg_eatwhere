'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

//TODO: Refactor in the future for more models such as Indian Food, Dessert 3D Models?
export function useRiceBowlModel() {
  const { scene } = useGLTF('/models/rice_bowl.glb');

  return useMemo(() => scene.clone(), [scene]);
}

useGLTF.preload('/models/rice_bowl.glb');
