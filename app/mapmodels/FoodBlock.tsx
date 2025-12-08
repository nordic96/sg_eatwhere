import { useMemo } from 'react';
import { EateryCategory, FoodHeritage } from '../types';
import { geoConverter } from '../utils';
import { FloatingMarker } from './FloatingMarker';
import { MODELS, useModel } from './models';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const CategoryAssetMap: Record<EateryCategory, keyof typeof MODELS> = {
  dessert: 'shophouse',
  restaurant: 'shophouse',
  hawker: 'hawkerStall',
};

export default function FoodBlock({ data }: { data: FoodHeritage }) {
  const { scene } = useModel(CategoryAssetMap[data.category]);
  const object = useMemo(() => clone(scene), [scene]);

  return (
    <FloatingMarker
      key={data.id}
      position={geoConverter(data.location.geoLocation)}
      floatHeight={5}
      data={data}
    >
      <group scale={[1.5, 1.5, 1.5]} position={[0, 1.5, 0]}>
        <primitive object={object} />
      </group>
    </FloatingMarker>
  );
}
