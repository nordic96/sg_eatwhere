import { renderHook, act } from '@testing-library/react';
import { useHeritageStore } from '@/app/stores/useHeritageStore';
import { FoodHeritage, EateryCategory } from '@/app/types';

describe('useHeritageStore', () => {
  // Mock food data
  const mockFoodData: FoodHeritage[] = [
    {
      id: 'hawker-1',
      name: 'Hawker Center',
      category: 'hawker',
      recommendations: ['Chicken Rice', 'Laksa'],
      imgSource: ['image1.jpg'],
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
      name: 'Fine Restaurant',
      category: 'restaurant',
      recommendations: ['Steak', 'Pasta'],
      imgSource: ['image2.jpg'],
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
      name: 'Sweet Dessert Shop',
      category: 'dessert',
      recommendations: ['Ice Cream', 'Cake'],
      imgSource: ['image3.jpg'],
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
    // Reset store before each test
    const { result } = renderHook(() => useHeritageStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('initial state', () => {
    test('has correct initial values', () => {
      const { result } = renderHook(() => useHeritageStore());

      expect(result.current.heritageId).toBeNull();
      expect(result.current.foodData).toEqual([]);
      expect(result.current.filter).toEqual(['hawker', 'dessert', 'restaurant']);
    });
  });

  describe('setHeritageId', () => {
    test('sets heritage ID', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setHeritageId('test-id');
      });

      expect(result.current.heritageId).toBe('test-id');
    });

    test('can set ID to null', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setHeritageId('test-id');
        result.current.setHeritageId(null);
      });

      expect(result.current.heritageId).toBeNull();
    });
  });

  describe('unSelect', () => {
    test('clears heritage ID', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setHeritageId('test-id');
        result.current.unSelect();
      });

      expect(result.current.heritageId).toBeNull();
    });
  });

  describe('setFoodData and getFoodData', () => {
    test('sets and retrieves food data', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
      });

      expect(result.current.getFoodData()).toEqual(mockFoodData);
      expect(result.current.foodData).toEqual(mockFoodData);
    });
  });

  describe('setFilter and unsetFilter', () => {
    test('adds filter category', () => {
      const { result } = renderHook(() => useHeritageStore());

      // First remove a filter
      act(() => {
        result.current.unsetFilter('hawker');
      });

      expect(result.current.filter).not.toContain('hawker');

      // Then add it back
      act(() => {
        result.current.setFilter('hawker');
      });

      expect(result.current.filter).toContain('hawker');
    });

    test('removes filter category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.unsetFilter('hawker');
      });

      expect(result.current.filter).not.toContain('hawker');
      expect(result.current.filter).toContain('dessert');
      expect(result.current.filter).toContain('restaurant');
    });

    test('prevents removing last filter', () => {
      const { result } = renderHook(() => useHeritageStore());

      // Remove filters until only one remains
      act(() => {
        result.current.unsetFilter('hawker');
        result.current.unsetFilter('dessert');
      });

      expect(result.current.filter.length).toBe(1);

      // Try to remove the last filter
      act(() => {
        result.current.unsetFilter('restaurant');
      });

      // Should still have one filter
      expect(result.current.filter.length).toBe(1);
      expect(result.current.filter).toContain('restaurant');
    });
  });

  describe('getFilteredFood', () => {
    test('returns all food when all filters active', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(3);
      expect(filtered).toEqual(mockFoodData);
    });

    test('filters by hawker only', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.unsetFilter('restaurant');
        result.current.unsetFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('hawker');
    });

    test('filters by restaurant only', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.unsetFilter('hawker');
        result.current.unsetFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('restaurant');
    });

    test('filters by multiple categories', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.unsetFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(2);
      expect(filtered.map(f => f.category)).toContain('hawker');
      expect(filtered.map(f => f.category)).toContain('restaurant');
    });
  });

  describe('getSelectedFoodData', () => {
    test('returns null when no ID selected', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
      });

      expect(result.current.getSelectedFoodData()).toBeNull();
    });

    test('returns selected food data', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('hawker-1');
      });

      const selected = result.current.getSelectedFoodData();

      expect(selected).not.toBeNull();
      expect(selected?.id).toBe('hawker-1');
      expect(selected?.name).toBe('Hawker Center');
    });

    test('returns null for non-existent ID', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('non-existent');
      });

      expect(result.current.getSelectedFoodData()).toBeNull();
    });
  });

  describe('getThemeStyle', () => {
    test('returns primary theme when no heritage selected', () => {
      const { result } = renderHook(() => useHeritageStore());

      const style = result.current.getThemeStyle();

      expect(style).toHaveProperty('bg-primary', true);
      expect(style).toHaveProperty('border-primary', true);
    });

    test('returns orange theme for restaurant category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('restaurant-1');
      });

      const style = result.current.getThemeStyle();

      expect(style).toHaveProperty('bg-outramorange', true);
      expect(style).toHaveProperty('border-outramorange', true);
      expect(style).toHaveProperty('bg-primary', false);
    });

    test('returns green theme for dessert category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('dessert-1');
      });

      const style = result.current.getThemeStyle();

      expect(style).toHaveProperty('bg-gardengreen', true);
      expect(style).toHaveProperty('border-gardengreen', true);
    });

    test('returns primary theme for hawker category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('hawker-1');
      });

      const style = result.current.getThemeStyle();

      expect(style).toHaveProperty('bg-primary', true);
      expect(style).toHaveProperty('border-primary', true);
    });

    test('returns primary theme for non-existent heritage', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('non-existent');
      });

      const style = result.current.getThemeStyle();

      expect(style).toHaveProperty('bg-primary', true);
      expect(style).toHaveProperty('border-primary', true);
    });
  });

  describe('reset', () => {
    test('resets store to initial state', () => {
      const { result } = renderHook(() => useHeritageStore());

      // Modify the store
      act(() => {
        result.current.setFoodData(mockFoodData);
        result.current.setHeritageId('test-id');
        result.current.unsetFilter('hawker');
      });

      // Verify it was modified
      expect(result.current.heritageId).toBe('test-id');
      expect(result.current.foodData).toEqual(mockFoodData);
      expect(result.current.filter).not.toContain('hawker');

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify reset
      expect(result.current.heritageId).toBeNull();
      expect(result.current.foodData).toEqual([]);
      expect(result.current.filter).toEqual(['hawker', 'dessert', 'restaurant']);
    });
  });
});
