import { renderHook, act } from '@testing-library/react';
import { useTrailStore } from '@/app/stores/useTrailStore';
import { useHeritageStore } from '@/app/stores/useHeritageStore';
import { FoodHeritage } from '@/app/types';

describe('useTrailStore', () => {
  // Mock food data
  const mockFoodData: FoodHeritage[] = [
    {
      id: 'food-1',
      name: 'Food 1',
      category: 'hawker',
      recommendations: ['Dish 1'],
      imgSource: ['img1.jpg'],
      location: {
        address: 'Address 1',
        gmapUrl: 'https://maps.google.com',
        mrt: ['MRT1'],
        region: 'central',
        geoLocation: { latitude: 1.0, longitude: 103.0 },
      },
    },
    {
      id: 'food-2',
      name: 'Food 2',
      category: 'restaurant',
      recommendations: ['Dish 2'],
      imgSource: ['img2.jpg'],
      location: {
        address: 'Address 2',
        gmapUrl: 'https://maps.google.com',
        mrt: ['MRT2'],
        region: 'east',
        geoLocation: { latitude: 2.0, longitude: 104.0 },
      },
    },
    {
      id: 'food-3',
      name: 'Food 3',
      category: 'dessert',
      recommendations: ['Dish 3'],
      imgSource: ['img3.jpg'],
      location: {
        address: 'Address 3',
        gmapUrl: 'https://maps.google.com',
        mrt: ['MRT3'],
        region: 'west',
        geoLocation: { latitude: 3.0, longitude: 105.0 },
      },
    },
    {
      id: 'food-4',
      name: 'Food 4',
      category: 'hawker',
      recommendations: ['Dish 4'],
      imgSource: ['img4.jpg'],
      location: {
        address: 'Address 4',
        gmapUrl: 'https://maps.google.com',
        mrt: ['MRT4'],
        region: 'north',
        geoLocation: { latitude: 4.0, longitude: 106.0 },
      },
    },
  ];

  beforeEach(() => {
    // Reset both stores
    const { result: heritageResult } = renderHook(() => useHeritageStore());
    act(() => {
      heritageResult.current.reset();
      heritageResult.current.setFoodData(mockFoodData);
    });
  });

  describe('initial state', () => {
    test('has correct initial values', () => {
      const { result } = renderHook(() => useTrailStore());

      expect(result.current.trailMode).toBe(false);
      expect(result.current.trailIds).toEqual([]);
    });
  });

  describe('toggleTrailMode', () => {
    test('enables trail mode and generates trails', () => {
      const { result } = renderHook(() => useTrailStore());

      act(() => {
        result.current.toggleTrailMode();
      });

      expect(result.current.trailMode).toBe(true);
      expect(result.current.trailIds.length).toBeGreaterThan(0);
    });

    test('sets first trail as selected heritage when enabling', () => {
      const { result: trailResult } = renderHook(() => useTrailStore());
      const { result: heritageResult } = renderHook(() => useHeritageStore());

      act(() => {
        trailResult.current.toggleTrailMode();
      });

      const firstTrailId = trailResult.current.trailIds[0];
      // If there are trails, the first one should be selected
      if (firstTrailId) {
        expect(heritageResult.current.heritageId).toBe(firstTrailId);
      } else {
        // If no trails were generated, heritageId should be null
        expect(heritageResult.current.heritageId).toBeNull();
      }
    });

    test('disables trail mode and clears trails', () => {
      const { result } = renderHook(() => useTrailStore());

      // First enable
      act(() => {
        result.current.toggleTrailMode();
      });

      expect(result.current.trailMode).toBe(true);

      // Then disable
      act(() => {
        result.current.toggleTrailMode();
      });

      expect(result.current.trailMode).toBe(false);
      expect(result.current.trailIds).toEqual([]);
    });

    test('unselects heritage when disabling trail mode', () => {
      const { result: trailResult } = renderHook(() => useTrailStore());
      const { result: heritageResult } = renderHook(() => useHeritageStore());

      // Enable trail mode
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      expect(heritageResult.current.heritageId).not.toBeNull();

      // Disable trail mode
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      expect(heritageResult.current.heritageId).toBeNull();
    });

    test('can be toggled multiple times', () => {
      const { result } = renderHook(() => useTrailStore());

      act(() => {
        result.current.toggleTrailMode();
      });
      expect(result.current.trailMode).toBe(true);

      act(() => {
        result.current.toggleTrailMode();
      });
      expect(result.current.trailMode).toBe(false);

      act(() => {
        result.current.toggleTrailMode();
      });
      expect(result.current.trailMode).toBe(true);
    });
  });

  describe('getFilteredTrails', () => {
    test('returns array of trail IDs', () => {
      const { result: trailResult } = renderHook(() => useTrailStore());

      // Enable trail mode
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      const filtered = trailResult.current.getFilteredTrails();

      expect(Array.isArray(filtered)).toBe(true);
      filtered.forEach((id) => {
        expect(typeof id).toBe('string');
      });
    });
  });

  describe('moveToNextTrail', () => {
    test('moves to next trail', () => {
      const { result: trailResult } = renderHook(() => useTrailStore());
      const { result: heritageResult } = renderHook(() => useHeritageStore());

      // Enable trail mode
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      const initialId = heritageResult.current.heritageId;

      // Move to next if there are trails
      const filteredTrails = trailResult.current.getFilteredTrails();
      if (filteredTrails.length > 1) {
        let index;
        act(() => {
          index = trailResult.current.moveToNextTrail();
        });

        const nextId = heritageResult.current.heritageId;
        expect(nextId).not.toBe(initialId);
        expect(typeof index).toBe('number');
        expect(index).toBeGreaterThanOrEqual(0);
      }
    });

    test('returns -1 when no trails available', () => {
      const { result: trailResult } = renderHook(() => useTrailStore());
      const { result: heritageResult } = renderHook(() => useHeritageStore());

      // Clear food data to have no trails
      act(() => {
        heritageResult.current.setFoodData([]);
        trailResult.current.toggleTrailMode();
      });

      let index;
      act(() => {
        index = trailResult.current.moveToNextTrail();
      });

      expect(index).toBe(-1);
    });
  });

  describe('integration with useHeritageStore', () => {
    test('trail IDs come from heritage store food data', () => {
      const { result: trailResult } = renderHook(() => useTrailStore());

      act(() => {
        trailResult.current.toggleTrailMode();
      });

      const allFoodIds = mockFoodData.map((f) => f.id);
      trailResult.current.trailIds.forEach((id) => {
        expect(allFoodIds).toContain(id);
      });
    });
  });
});
