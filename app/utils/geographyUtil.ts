// utils/geographyCalibrator.ts

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

const songfa = { latitude: 1.2890347925294459, longitude: 103.84776780251772 };
const songfaScene: [number, number, number] = [2, 0, 13.1];

const taihwa = { latitude: 1.3053195659241765, longitude: 103.86303995673765 };
const taihwaScene: [number, number, number] = [10.5, 0, 4];

export const geoConverter = createConverterTwoPoint(songfa, songfaScene, taihwa, taihwaScene);
