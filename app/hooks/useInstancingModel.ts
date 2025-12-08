import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

export function useInstancingModel(path: string) {
  const { scene } = useGLTF(path);

  return useMemo(() => {
    const mesh = scene.children[0] as THREE.Mesh;
    return {
      geometry: mesh.geometry,
      material: mesh.material,
    };
  }, [scene]);
}
