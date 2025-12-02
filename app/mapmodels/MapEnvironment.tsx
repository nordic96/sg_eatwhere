'use client';

import { Vector3 } from 'three';
import * as THREE from 'three';

import { useEnvironmentStore } from '../stores/useEnvironmentStore';
import { Cloud, Clouds, Sky, Stars } from '@react-three/drei';
import TextureMap from './TextureMap';

export default function MapEnvironment() {
  const { isNight, sunPosition, moonPosition, ambientIntensity, sunIntensity } =
    useEnvironmentStore();
  return (
    <>
      {/* --- Ambient Day/Night Light --- */}
      <ambientLight intensity={ambientIntensity} />

      {/* --- Sun Light (moves) --- */}
      <directionalLight
        position={new Vector3(...sunPosition)}
        intensity={sunIntensity}
        color={'#ffffff'}
      />

      {/* --- Moon Light (only visible at night) --- */}
      {isNight && (
        <directionalLight
          position={new Vector3(...moonPosition)}
          intensity={0.3}
          color={'#bcd4ff'}
        />
      )}

      {/* --- Sky Atmosphere --- */}
      <Sky
        distance={4500}
        sunPosition={new Vector3(...sunPosition)}
        mieDirectionalG={0.01}
        inclination={0.5}
        azimuth={0.25}
      />

      {/* --- Stars (night only) --- */}
      {isNight && <Stars radius={200} depth={50} count={1000} factor={4} fade speed={1} />}

      {/* --- The Map Plane --- */}
      <TextureMap />

      <Clouds
        material={THREE.MeshBasicMaterial}
        position={[0, 60, 0]}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Cloud segments={50} bounds={[300, 5, 190]} volume={50} color="#fefefe" />
        <Cloud
          seed={1}
          segments={50}
          bounds={[150, 5, 100]}
          scale={2}
          volume={50}
          color="#fdfdfd"
          fade={100}
        />
      </Clouds>
    </>
  );
}
