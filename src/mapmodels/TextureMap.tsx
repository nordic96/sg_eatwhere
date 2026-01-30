/* eslint-disable react-hooks/immutability */
import { useTexture } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';

export default function TextureMap() {
  const texture = useTexture(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Singapore_MRT_Network_%28with_Hume%29.svg/2560px-Singapore_MRT_Network_%28with_Hume%29.svg.png',
  );
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[300, 190, 1, 1]} />
      <meshStandardMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
