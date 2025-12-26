import { useMemo } from 'react';
import { useHeritageStore } from '../stores';
import { useModel } from './models';
import { geoConverter } from '../utils';
import { Vector3 } from 'three';
import { Glow } from './GlowSprite';
import { useEnvironmentStore } from '../stores/useEnvironmentStore';
import { FLOAT_OFFSET } from '../constants';

const SCALE_VECTOR = new Vector3(1.5, 1.5, 1.5);
const GLOW_POSITION = new Vector3(0, 1.3, 0);

export default function LocationPin() {
  const { getSelectedFoodData, heritageId } = useHeritageStore();
  const { isNight } = useEnvironmentStore();
  const { scene } = useModel('locationpin');

  const position = useMemo(() => {
    const data = getSelectedFoodData();
    if (data === null || heritageId === null) return null;

    const pos = geoConverter(data.location.geoLocation);
    pos[1] += FLOAT_OFFSET + 2;
    return pos;
  }, [getSelectedFoodData, heritageId]);

  if (position === null) return null;
  return (
    <group position={position} scale={SCALE_VECTOR}>
      <primitive object={scene} />
      {isNight && <Glow position={GLOW_POSITION} scale={[1, 1]} />}
    </group>
  );
}
