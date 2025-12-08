import { useMemo } from 'react';
import { FoodHeritage } from '../types';
import { geoConverter } from '../utils';
import { Glow } from './GlowSprite';
import { Vector3 } from 'three';
import { useHeritageStore } from '../stores';

export default function GlowInstances({
  buildings,
  isNight = false,
}: {
  buildings: FoodHeritage[];
  isNight: boolean;
}) {
  const { filter } = useHeritageStore();
  // Only calculate positions when building list changes
  const positions = useMemo(
    () =>
      buildings
        .filter((b) => filter.includes(b.category))
        .map((b) => {
          const [x, y, z] = geoConverter(b.location.geoLocation);
          return [x, y + 1.5, z]; // lift glow above the model
        }),
    [buildings, filter],
  );

  return (
    <>
      {isNight &&
        positions.map((p, index) => (
          <Glow key={index} position={new Vector3(...p)} scale={[4, 4]} />
        ))}
    </>
  );
}
