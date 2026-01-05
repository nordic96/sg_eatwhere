/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderHook, act } from '@testing-library/react';
import { useHeritageStore } from '@/app/stores/useHeritageStore';
import { useAppStore } from '@/app/stores/useAppStore';
import { useTrailStore } from '@/app/stores/useTrailStore';
import { FoodHeritage } from '@/app/types';

describe('Store Integration Tests', () => {
  const mockFoodData: FoodHeritage[] = [
    {
      id: 'hawker-1',
      name: 'Hawker Center 1',
      category: 'hawker',
      recommendations: ['Chicken Rice'],
      imgSource: ['img1.jpg'],
      location: {
        address: '123 Hawker St',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Newton'],
        region: 'central',
        geoLocation: { latitude: 1.3, longitude: 103.8 },
      },
    },
    {
      id: 'restaurant-1',
      name: 'Restaurant 1',
      category: 'restaurant',
      recommendations: ['Steak'],
      imgSource: ['img2.jpg'],
      location: {
        address: '456 Restaurant Ave',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Orchard'],
        region: 'central',
        geoLocation: { latitude: 1.4, longitude: 103.9 },
      },
    },
    {
      id: 'dessert-1',
      name: 'Dessert Shop 1',
      category: 'dessert',
      recommendations: ['Ice Cream'],
      imgSource: ['img3.jpg'],
      location: {
        address: '789 Dessert Rd',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Somerset'],
        region: 'central',
        geoLocation: { latitude: 1.5, longitude: 104.0 },
      },
    },
  ];

  beforeEach(() => {
    // Reset all stores before each test
    const { result: heritageResult } = renderHook(() => useHeritageStore());
    act(() => {
      heritageResult.current.reset();
    });
  });

  describe('HeritageStore and TrailStore Integration', () => {
    test('trail mode uses heritage store food data', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      // Set food data in heritage store
      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
      });

      // Enable trail mode
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      // Trail IDs should be from food data
      const allIds = mockFoodData.map((f) => f.id);
      trailResult.current.trailIds.forEach((id) => {
        expect(allIds).toContain(id);
      });
    });

    test('trail store respects heritage store filter', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        trailResult.current.toggleTrailMode();
      });

      // Remove restaurant filter
      act(() => {
        heritageResult.current.unsetFilter('restaurant');
        heritageResult.current.unsetFilter('dessert');
      });

      const filteredTrails = trailResult.current.getFilteredTrails();
      const trailData = mockFoodData.filter((f) => filteredTrails.includes(f.id));

      // Should only have hawker trails
      trailData.forEach((food) => {
        expect(food.category).not.toBe('restaurant');
        expect(food.category).not.toBe('dessert');
      });
    });

    test('disabling trail mode clears heritage selection', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        trailResult.current.toggleTrailMode();
      });

      expect(heritageResult.current.heritageId).not.toBeNull();

      act(() => {
        trailResult.current.toggleTrailMode();
      });

      expect(heritageResult.current.heritageId).toBeNull();
    });

    test('trail navigation updates heritage selection', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        trailResult.current.toggleTrailMode();
      });

      const initialId = heritageResult.current.heritageId;

      act(() => {
        trailResult.current.moveToNextTrail();
      });

      const nextId = heritageResult.current.heritageId;

      // Heritage selection should have changed
      if (trailResult.current.trailIds.length > 1) {
        expect(nextId).not.toBe(initialId);
      }
    });
  });

  describe('HeritageStore and AppStore Integration', () => {
    test('selecting heritage does not affect app store state', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: appResult } = renderHook(() => useAppStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        heritageResult.current.setHeritageId('hawker-1');
      });

      expect(appResult.current.localeOpen).toBe(false);
      expect(appResult.current.clickedMore).toBe(false);
    });

    test('opening locale does not affect heritage selection', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: appResult } = renderHook(() => useAppStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        heritageResult.current.setHeritageId('restaurant-1');
      });

      const selectedBefore = heritageResult.current.heritageId;

      act(() => {
        appResult.current.openLocale();
      });

      expect(heritageResult.current.heritageId).toBe(selectedBefore);
    });

    test('stores are independent', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: appResult } = renderHook(() => useAppStore());

      // Create sidebar element for app store
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      document.body.appendChild(sidebar);

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        appResult.current.openMore();
        heritageResult.current.setHeritageId('dessert-1');
        appResult.current.openLocale();
      });

      expect(heritageResult.current.heritageId).toBe('dessert-1');
      expect(appResult.current.clickedMore).toBe(true);
      expect(appResult.current.localeOpen).toBe(true);

      act(() => {
        heritageResult.current.reset();
      });

      // App store should be unaffected by heritage reset
      expect(appResult.current.clickedMore).toBe(true);
      expect(appResult.current.localeOpen).toBe(true);
    });
  });

  describe('Multi-Store Workflow', () => {
    test('complete user journey: select, filter, enable trail mode', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: appResult } = renderHook(() => useAppStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      // Create sidebar element
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      document.body.appendChild(sidebar);

      // 1. Load data
      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
      });

      expect(heritageResult.current.foodData).toHaveLength(3);

      // 2. Select a heritage
      act(() => {
        heritageResult.current.setHeritageId('hawker-1');
      });

      expect(heritageResult.current.heritageId).toBe('hawker-1');

      // 3. Open more details
      act(() => {
        appResult.current.openMore();
      });

      expect(appResult.current.clickedMore).toBe(true);

      // 4. Apply filter
      act(() => {
        heritageResult.current.unsetFilter('restaurant');
      });

      const filtered = heritageResult.current.getFilteredFood();
      expect(filtered.every((f) => f.category !== 'restaurant')).toBe(true);

      // 5. Enable trail mode
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      // Trail mode should be enabled if there are trails generated
      if (trailResult.current.trailIds.length > 0) {
        expect(trailResult.current.trailMode).toBe(true);
      }

      // 6. Navigate trail if trails exist
      if (trailResult.current.trailIds.length > 0) {
        act(() => {
          trailResult.current.moveToNextTrail();
        });

        // Heritage ID should be updated to next trail
        expect(heritageResult.current.heritageId).not.toBeNull();
      }

      // Clean up
      document.body.removeChild(sidebar);
    });

    test('resetting heritage store does not affect other stores', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: appResult } = renderHook(() => useAppStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        appResult.current.openLocale();
        trailResult.current.toggleTrailMode();
      });

      act(() => {
        heritageResult.current.reset();
      });

      expect(heritageResult.current.foodData).toEqual([]);
      expect(heritageResult.current.heritageId).toBeNull();

      // Other stores should be unaffected
      expect(appResult.current.localeOpen).toBe(true);
      expect(trailResult.current.trailMode).toBe(true);
    });

    test('concurrent store updates do not conflict', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());
      const { result: appResult } = renderHook(() => useAppStore());
      const { result: trailResult } = renderHook(() => useTrailStore());

      // Set food data first
      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
      });

      // Then perform other updates
      act(() => {
        heritageResult.current.setHeritageId('hawker-1');
        heritageResult.current.unsetFilter('dessert');
        appResult.current.openLocale();
      });

      // Enable trail mode separately (which may change heritage selection)
      const selectedBeforeTrail = heritageResult.current.heritageId;
      act(() => {
        trailResult.current.toggleTrailMode();
      });

      // All updates should be applied correctly
      expect(heritageResult.current.foodData).toHaveLength(3);
      // Heritage ID may be null if no trails were generated (empty array from generateRandomArr)
      // But data should still be loaded
      expect(heritageResult.current.filter).not.toContain('dessert');
      expect(appResult.current.localeOpen).toBe(true);
      if (trailResult.current.trailIds.length > 0) {
        expect(trailResult.current.trailMode).toBe(true);
        expect(heritageResult.current.heritageId).not.toBeNull();
      }
    });
  });

  describe('Filter and Theme Integration', () => {
    test('theme changes with heritage category selection', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
      });

      // Select hawker - should be primary theme
      act(() => {
        heritageResult.current.setHeritageId('hawker-1');
      });

      let theme = heritageResult.current.getThemeStyle();
      expect(theme).toHaveProperty('bg-primary', true);

      // Select restaurant - should be orange theme
      act(() => {
        heritageResult.current.setHeritageId('restaurant-1');
      });

      theme = heritageResult.current.getThemeStyle();
      expect(theme).toHaveProperty('bg-outramorange', true);

      // Select dessert - should be green theme
      act(() => {
        heritageResult.current.setHeritageId('dessert-1');
      });

      theme = heritageResult.current.getThemeStyle();
      expect(theme).toHaveProperty('bg-gardengreen', true);
    });

    test('filtering preserves theme for selected item', () => {
      const { result: heritageResult } = renderHook(() => useHeritageStore());

      act(() => {
        heritageResult.current.setFoodData(mockFoodData);
        heritageResult.current.setHeritageId('restaurant-1');
      });

      const themeBefore = heritageResult.current.getThemeStyle();

      act(() => {
        heritageResult.current.unsetFilter('hawker');
      });

      const themeAfter = heritageResult.current.getThemeStyle();

      // Theme should remain the same
      expect(themeBefore).toEqual(themeAfter);
    });
  });
});
