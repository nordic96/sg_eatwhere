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
  const glowPositions = useMemo(
    () =>
      buildings
        .filter((b) => filter.includes(b.category))
        .map((b) => {
          const [x, y, z] = geoConverter(b.location.geoLocation);
          return new Vector3(x, y + 1.5, z); // lift glow above the model
        }),
    [buildings, filter],
  );

  return (
    <>
      {isNight &&
        glowPositions.map((position, index) => (
          <Glow key={index} position={position} scale={[4, 4]} />
        ))}
    </>
  );
}
