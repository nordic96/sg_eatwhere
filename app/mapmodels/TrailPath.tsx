import * as THREE from 'three';
import { Line, LineProps } from '@react-three/drei';
import { useMemo } from 'react';
import { useHeritageStore } from '../stores';
import { geoConverter, sortByNearestFromCentroid, Vec3 } from '../utils';

type TrailPathProps = Omit<LineProps, 'points' | 'color'>;
export default function TrailPath(lineProps: TrailPathProps) {
  const locations = useHeritageStore((state) => state.foodData);
  const points = useMemo(() => {
    const vectors: Vec3[] = locations.map((l) => {
      const [x, y, z] = geoConverter(l.location.geoLocation);
      return [x, y + 10, z];
    });
    return sortByNearestFromCentroid(vectors);
  }, [locations]);

  const curvePoints = useMemo(() => {
    if (points.length < 2) return points;
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
    return curve.getPoints(200);
  }, [points]);

  return (
    <Line
      points={curvePoints}
      color={'#A7292C'}
      lineWidth={15}
      transparent
      opacity={0.9}
      {...lineProps}
    />
  );
}
