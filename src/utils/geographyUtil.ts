/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/geographyCalibrator.ts
import * as THREE from 'three';

export type LatLng = { latitude: number; longitude: number };
export type Vec3 = [number, number, number];

/**
 * Create a converter from lat/lng -> scene [x,y,z] using two calibration points.
 * This assumes x depends on longitude and z depends on latitude (no cross-terms).
 *
 * origin: real-world lat/lng that maps to originScene (scene coordinates)
 * sample: another real-world lat/lng with known scene coordinates
 *
 * Returns: (point) => [x, y (0), z]
 */
export function createConverterTwoPoint(
  origin: LatLng,
  originScene: Vec3,
  sample: LatLng,
  sampleScene: Vec3,
) {
  // deltas in degrees
  const dLat = sample.latitude - origin.latitude;
  const dLng = sample.longitude - origin.longitude;

  // deltas in scene units
  const dX = sampleScene[0] - originScene[0];
  const dZ = sampleScene[2] - originScene[2];

  // guard for zero delta
  if (Math.abs(dLng) < 1e-12 || Math.abs(dLat) < 1e-12) {
    console.warn('Calibration points are too close or share same lat/lng.');
  }

  // scales: scene-units per degree
  const scaleLng = dX / dLng; // how many scene units per degree longitude
  const scaleLat = dZ / dLat; // how many scene units per degree latitude

  return (p: LatLng): Vec3 => {
    const dx = (p.longitude - origin.longitude) * scaleLng + originScene[0];
    const dz = (p.latitude - origin.latitude) * scaleLat + originScene[2];
    return [dx, 0, dz];
  };
}

const hollandV = { latitude: 1.3111927720357135, longitude: 103.79626167383837 };
const hollandVScene = [-31, 0, 20] as Vec3;
const tampinesV = { latitude: 1.3533165106123863, longitude: 103.94507710989102 };
const tampinesVScene = [58, 0, -9] as Vec3;
export const geoConverter = createConverterTwoPoint(
  hollandV,
  hollandVScene,
  tampinesV,
  tampinesVScene,
);

export function findCentroid(points: Vec3[]): Vec3 {
  if (points.length === 0) {
    return [0, 0, 0];
  }
  let xSum = 0,
    ySum = 0,
    zSum = 0;
  for (const [x, y, z] of points) {
    xSum += x;
    ySum += y;
    zSum += z;
  }
  const n = points.length;
  return [xSum / n, ySum / n, zSum / n];
}

export function sortByNearestFromCentroid(vectors: Vec3[]): THREE.Vector3[] {
  const [cx, cy, cz] = findCentroid(vectors);
  return vectors
    .map(([x, y, z]) => {
      const angle = Math.atan2(z + cz, x + cx);
      return [x, y, z, angle];
    })
    .sort((a, b) => a[3] - b[3])
    .map((a) => new THREE.Vector3(a[0], a[1], a[2]));
}
