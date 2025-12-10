import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { isProductionMode } from '../utils';

export function useInstancingModel(path: string) {
  const { scene } = useGLTF(path);

  return useMemo(() => {
    const mesh = scene.children[0] as THREE.Mesh;
    if (!isProductionMode()) {
      return {
        geometry: new THREE.BoxGeometry(2, 3, 2),
        material: new THREE.MeshBasicMaterial({ color: 'black' }),
      };
    }
    return {
      geometry: mesh.geometry,
      material: mesh.material,
    };
  }, [scene]);
}
