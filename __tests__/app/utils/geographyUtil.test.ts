import {
  createConverterTwoPoint,
  findCentroid,
  sortByNearestFromCentroid,
  geoConverter,
  LatLng,
  Vec3,
} from '@/app/utils/geographyUtil';
import * as THREE from 'three';

describe('geographyUtil', () => {
  describe('createConverterTwoPoint', () => {
    const origin: LatLng = { latitude: 1.0, longitude: 103.0 };
    const originScene: Vec3 = [0, 0, 0];
    const sample: LatLng = { latitude: 2.0, longitude: 104.0 };
    const sampleScene: Vec3 = [100, 0, 50];

    test('creates a converter function', () => {
      const converter = createConverterTwoPoint(origin, originScene, sample, sampleScene);

      expect(typeof converter).toBe('function');
    });

    test('origin point maps to origin scene coordinates', () => {
      const converter = createConverterTwoPoint(origin, originScene, sample, sampleScene);
      const result = converter(origin);

      expect(result[0]).toBeCloseTo(originScene[0], 5);
      expect(result[1]).toBe(0); // y is always 0
      expect(result[2]).toBeCloseTo(originScene[2], 5);
    });

    test('sample point maps to sample scene coordinates', () => {
      const converter = createConverterTwoPoint(origin, originScene, sample, sampleScene);
      const result = converter(sample);

      expect(result[0]).toBeCloseTo(sampleScene[0], 5);
      expect(result[1]).toBe(0); // y is always 0
      expect(result[2]).toBeCloseTo(sampleScene[2], 5);
    });

    test('midpoint between origin and sample', () => {
      const converter = createConverterTwoPoint(origin, originScene, sample, sampleScene);
      const midpoint: LatLng = { latitude: 1.5, longitude: 103.5 };
      const result = converter(midpoint);

      // Should be roughly midway in scene coordinates
      expect(result[0]).toBeCloseTo(50, 5);
      expect(result[1]).toBe(0);
      expect(result[2]).toBeCloseTo(25, 5);
    });

    test('y-coordinate is always 0', () => {
      const converter = createConverterTwoPoint(origin, originScene, sample, sampleScene);
      const testPoint: LatLng = { latitude: 1.5, longitude: 103.5 };
      const result = converter(testPoint);

      expect(result[1]).toBe(0);
    });

    test('handles negative coordinates', () => {
      const converter = createConverterTwoPoint(origin, originScene, sample, sampleScene);
      const testPoint: LatLng = { latitude: 0.5, longitude: 102.5 };
      const result = converter(testPoint);

      // Should extrapolate to negative values
      expect(result[0]).toBeCloseTo(-50, 5);
      expect(result[2]).toBeCloseTo(-25, 5);
    });

    test('warns when calibration points are too close', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const closeSample: LatLng = { latitude: 1.0, longitude: 103.0 };

      createConverterTwoPoint(origin, originScene, closeSample, sampleScene);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Calibration points are too close or share same lat/lng.'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('geoConverter (pre-configured converter)', () => {
    test('geoConverter exists and is a function', () => {
      expect(typeof geoConverter).toBe('function');
    });

    test('geoConverter handles Singapore coordinates', () => {
      const singaporeCenter: LatLng = { latitude: 1.3521, longitude: 103.8198 };
      const result = geoConverter(singaporeCenter);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
      expect(typeof result[2]).toBe('number');
    });

    test('geoConverter y-coordinate is always 0', () => {
      const point: LatLng = { latitude: 1.3, longitude: 103.8 };
      const result = geoConverter(point);

      expect(result[1]).toBe(0);
    });
  });

  describe('findCentroid', () => {
    test('returns origin for empty array', () => {
      const result = findCentroid([]);

      expect(result).toEqual([0, 0, 0]);
    });

    test('returns same point for single point', () => {
      const points: Vec3[] = [[5, 10, 15]];
      const result = findCentroid(points);

      expect(result).toEqual([5, 10, 15]);
    });

    test('calculates centroid for two points', () => {
      const points: Vec3[] = [
        [0, 0, 0],
        [10, 10, 10],
      ];
      const result = findCentroid(points);

      expect(result).toEqual([5, 5, 5]);
    });

    test('calculates centroid for multiple points', () => {
      const points: Vec3[] = [
        [0, 0, 0],
        [10, 0, 0],
        [0, 10, 0],
        [0, 0, 10],
      ];
      const result = findCentroid(points);

      expect(result[0]).toBeCloseTo(2.5, 5);
      expect(result[1]).toBeCloseTo(2.5, 5);
      expect(result[2]).toBeCloseTo(2.5, 5);
    });

    test('handles negative coordinates', () => {
      const points: Vec3[] = [
        [-10, -10, -10],
        [10, 10, 10],
      ];
      const result = findCentroid(points);

      expect(result).toEqual([0, 0, 0]);
    });

    test('calculates centroid correctly for asymmetric points', () => {
      const points: Vec3[] = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = findCentroid(points);

      expect(result[0]).toBeCloseTo(4, 5);
      expect(result[1]).toBeCloseTo(5, 5);
      expect(result[2]).toBeCloseTo(6, 5);
    });
  });

  describe('sortByNearestFromCentroid', () => {
    test('returns empty array for empty input', () => {
      const result = sortByNearestFromCentroid([]);

      expect(result).toEqual([]);
    });

    test('returns single point as THREE.Vector3', () => {
      const points: Vec3[] = [[1, 2, 3]];
      const result = sortByNearestFromCentroid(points);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(THREE.Vector3);
      expect(result[0].x).toBe(1);
      expect(result[0].y).toBe(2);
      expect(result[0].z).toBe(3);
    });

    test('sorts points by angle from centroid', () => {
      const points: Vec3[] = [
        [10, 0, 0],
        [0, 0, 10],
        [-10, 0, 0],
        [0, 0, -10],
      ];
      const result = sortByNearestFromCentroid(points);

      expect(result.length).toBe(4);
      result.forEach(v => {
        expect(v).toBeInstanceOf(THREE.Vector3);
      });

      // Points should be sorted by angle, creating a circular ordering
      // We can verify they're sorted without checking exact order
      const angles = result.map(v => Math.atan2(v.z, v.x));
      for (let i = 1; i < angles.length; i++) {
        expect(angles[i]).toBeGreaterThanOrEqual(angles[i - 1]);
      }
    });

    test('converts Vec3 tuples to THREE.Vector3 objects', () => {
      const points: Vec3[] = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const result = sortByNearestFromCentroid(points);

      result.forEach(v => {
        expect(v).toBeInstanceOf(THREE.Vector3);
        expect(typeof v.x).toBe('number');
        expect(typeof v.y).toBe('number');
        expect(typeof v.z).toBe('number');
      });
    });

    test('handles points around origin', () => {
      const points: Vec3[] = [
        [1, 0, 0],
        [0, 0, 1],
        [-1, 0, 0],
        [0, 0, -1],
      ];
      const result = sortByNearestFromCentroid(points);

      expect(result.length).toBe(4);

      // Verify all points are present
      const coords = result.map(v => [v.x, v.y, v.z]);
      expect(coords).toContainEqual([1, 0, 0]);
      expect(coords).toContainEqual([0, 0, 1]);
      expect(coords).toContainEqual([-1, 0, 0]);
      expect(coords).toContainEqual([0, 0, -1]);
    });

    test('maintains all original points', () => {
      const points: Vec3[] = [
        [5, 5, 5],
        [10, 10, 10],
        [-5, -5, -5],
      ];
      const result = sortByNearestFromCentroid(points);

      expect(result.length).toBe(points.length);
    });
  });
});
