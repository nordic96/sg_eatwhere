import { renderHook, act } from '@testing-library/react';
import { useHeritageStore } from '@/app/stores/useHeritageStore';
import { FoodHeritage } from '@/app/types';

describe('Heritage Filtering Workflow Integration Tests', () => {
  // Comprehensive mock data representing different regions and categories
  const comprehensiveMockData: FoodHeritage[] = [
    {
      id: 'hawker-central-1',
      name: 'Maxwell Food Centre',
      category: 'hawker',
      recommendations: ['Chicken Rice', 'Laksa'],
      imgSource: ['maxwell1.jpg'],
      location: {
        address: 'Maxwell Road',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Chinatown'],
        region: 'central',
        geoLocation: { latitude: 1.28, longitude: 103.84 },
      },
    },
    {
      id: 'hawker-east-1',
      name: 'Old Airport Road Food Centre',
      category: 'hawker',
      recommendations: ['Hokkien Mee', 'Satay'],
      imgSource: ['airport1.jpg'],
      location: {
        address: 'Old Airport Road',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Dakota'],
        region: 'east',
        geoLocation: { latitude: 1.31, longitude: 103.88 },
      },
    },
    {
      id: 'restaurant-central-1',
      name: 'Jumbo Seafood',
      category: 'restaurant',
      recommendations: ['Chilli Crab', 'Black Pepper Crab'],
      imgSource: ['jumbo1.jpg'],
      location: {
        address: 'Riverside Point',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Clarke Quay'],
        region: 'central',
        geoLocation: { latitude: 1.29, longitude: 103.85 },
      },
    },
    {
      id: 'restaurant-west-1',
      name: 'Long Beach Seafood',
      category: 'restaurant',
      recommendations: ['Cereal Prawns', 'Sambal Stingray'],
      imgSource: ['longbeach1.jpg'],
      location: {
        address: 'Jalan Jurong Kechil',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Hillview'],
        region: 'west',
        geoLocation: { latitude: 1.36, longitude: 103.76 },
      },
    },
    {
      id: 'dessert-central-1',
      name: 'Birds of Paradise',
      category: 'dessert',
      recommendations: ['Pandan Ice Cream', 'Pulut Hitam Gelato'],
      imgSource: ['bop1.jpg'],
      location: {
        address: 'East Coast Road',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Paya Lebar'],
        region: 'central',
        geoLocation: { latitude: 1.31, longitude: 103.91 },
      },
    },
    {
      id: 'dessert-north-1',
      name: 'Udders Ice Cream',
      category: 'dessert',
      recommendations: ['Mao Shan Wang', 'Rum Raisin'],
      imgSource: ['udders1.jpg'],
      location: {
        address: 'Upper Thomson Road',
        gmapUrl: 'https://maps.google.com',
        mrt: ['Caldecott'],
        region: 'north',
        geoLocation: { latitude: 1.34, longitude: 103.84 },
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

  describe('Initial State and Data Loading', () => {
    test('starts with all filters enabled', () => {
      const { result } = renderHook(() => useHeritageStore());

      expect(result.current.filter).toContain('hawker');
      expect(result.current.filter).toContain('restaurant');
      expect(result.current.filter).toContain('dessert');
      expect(result.current.filter).toHaveLength(3);
    });

    test('loading data shows all items when all filters active', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
      });

      const filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(6);
    });

    test('no heritage selected initially', () => {
      const { result } = renderHook(() => useHeritageStore());

      expect(result.current.heritageId).toBeNull();
      expect(result.current.getSelectedFoodData()).toBeNull();
    });
  });

  describe('Single Category Filtering', () => {
    test('filtering to hawker only shows hawker items', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('restaurant');
        result.current.unsetFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.category === 'hawker')).toBe(true);
      expect(filtered.map(f => f.id)).toContain('hawker-central-1');
      expect(filtered.map(f => f.id)).toContain('hawker-east-1');
    });

    test('filtering to restaurant only shows restaurant items', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
        result.current.unsetFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.category === 'restaurant')).toBe(true);
    });

    test('filtering to dessert only shows dessert items', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
        result.current.unsetFilter('restaurant');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.category === 'dessert')).toBe(true);
    });
  });

  describe('Multi-Category Filtering', () => {
    test('filtering to hawker and restaurant excludes desserts', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(4);
      expect(filtered.every(f => f.category !== 'dessert')).toBe(true);
    });

    test('filtering to hawker and dessert excludes restaurants', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('restaurant');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(4);
      expect(filtered.every(f => f.category !== 'restaurant')).toBe(true);
    });

    test('filtering to restaurant and dessert excludes hawkers', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
      });

      const filtered = result.current.getFilteredFood();

      expect(filtered).toHaveLength(4);
      expect(filtered.every(f => f.category !== 'hawker')).toBe(true);
    });
  });

  describe('Filter State Management', () => {
    test('cannot remove last remaining filter', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
        result.current.unsetFilter('restaurant');
      });

      expect(result.current.filter).toContain('dessert');
      expect(result.current.filter).toHaveLength(1);

      // Try to remove last filter
      act(() => {
        result.current.unsetFilter('dessert');
      });

      // Should still have dessert filter
      expect(result.current.filter).toContain('dessert');
      expect(result.current.filter).toHaveLength(1);
    });

    test('can add back removed filters', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
      });

      expect(result.current.filter).not.toContain('hawker');

      act(() => {
        result.current.setFilter('hawker');
      });

      expect(result.current.filter).toContain('hawker');
    });

    test('filter changes update filtered results immediately', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
      });

      let filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(6);

      act(() => {
        result.current.unsetFilter('hawker');
      });

      filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(4);

      act(() => {
        result.current.unsetFilter('restaurant');
      });

      filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(2);
    });
  });

  describe('Selection and Filtering Interaction', () => {
    test('selecting heritage item works with active filters', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.setHeritageId('hawker-central-1');
      });

      expect(result.current.getSelectedFoodData()?.name).toBe('Maxwell Food Centre');
    });

    test('can select item from filtered category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('restaurant');
        result.current.unsetFilter('dessert');
        result.current.setHeritageId('hawker-east-1');
      });

      const selected = result.current.getSelectedFoodData();
      expect(selected?.category).toBe('hawker');
      expect(selected?.name).toBe('Old Airport Road Food Centre');
    });

    test('can select item from non-filtered category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
        result.current.setHeritageId('restaurant-central-1');
      });

      const selected = result.current.getSelectedFoodData();
      expect(selected).not.toBeNull();
      expect(selected?.category).toBe('restaurant');
    });

    test('filtering out selected item category does not clear selection', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.setHeritageId('hawker-central-1');
      });

      expect(result.current.heritageId).toBe('hawker-central-1');

      act(() => {
        result.current.unsetFilter('hawker');
      });

      // Selection should remain but be filtered out
      expect(result.current.heritageId).toBe('hawker-central-1');
      const filtered = result.current.getFilteredFood();
      expect(filtered.find(f => f.id === 'hawker-central-1')).toBeUndefined();
    });
  });

  describe('Complete Workflow Scenarios', () => {
    test('browse hawkers, select one, view details, filter to restaurants', () => {
      const { result } = renderHook(() => useHeritageStore());

      // Load all data
      act(() => {
        result.current.setFoodData(comprehensiveMockData);
      });

      // Filter to hawkers only
      act(() => {
        result.current.unsetFilter('restaurant');
        result.current.unsetFilter('dessert');
      });

      let filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(2);

      // Select a hawker
      act(() => {
        result.current.setHeritageId('hawker-central-1');
      });

      let selected = result.current.getSelectedFoodData();
      expect(selected?.category).toBe('hawker');

      // Change filter to restaurants
      act(() => {
        result.current.setFilter('restaurant');
        result.current.unsetFilter('hawker');
      });

      filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.category === 'restaurant')).toBe(true);

      // Previous selection should still exist but be filtered out
      selected = result.current.getSelectedFoodData();
      expect(selected?.category).toBe('hawker');
    });

    test('explore all categories, select from each, verify theme changes', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
      });

      // Select hawker
      act(() => {
        result.current.setHeritageId('hawker-central-1');
      });

      let theme = result.current.getThemeStyle();
      expect(theme).toHaveProperty('bg-primary', true);

      // Select restaurant
      act(() => {
        result.current.setHeritageId('restaurant-central-1');
      });

      theme = result.current.getThemeStyle();
      expect(theme).toHaveProperty('bg-outramorange', true);

      // Select dessert
      act(() => {
        result.current.setHeritageId('dessert-central-1');
      });

      theme = result.current.getThemeStyle();
      expect(theme).toHaveProperty('bg-gardengreen', true);
    });

    test('progressive filtering from all to specific category', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
      });

      // Start: all 6 items
      let filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(6);

      // Remove desserts: 4 items (2 hawker + 2 restaurant)
      act(() => {
        result.current.unsetFilter('dessert');
      });

      filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(4);

      // Remove hawkers: 2 items (2 restaurant)
      act(() => {
        result.current.unsetFilter('hawker');
      });

      filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.category === 'restaurant')).toBe(true);

      // Add back all filters: 6 items
      act(() => {
        result.current.setFilter('hawker');
        result.current.setFilter('dessert');
      });

      filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(6);
    });

    test('reset clears selection and data but preserves filters', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.setHeritageId('hawker-central-1');
        result.current.unsetFilter('dessert');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.heritageId).toBeNull();
      expect(result.current.foodData).toEqual([]);
      expect(result.current.filter).toEqual(['hawker', 'dessert', 'restaurant']);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles empty food data array', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData([]);
      });

      const filtered = result.current.getFilteredFood();
      expect(filtered).toEqual([]);
    });

    test('handles selection of non-existent heritage ID', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.setHeritageId('non-existent-id');
      });

      const selected = result.current.getSelectedFoodData();
      expect(selected).toBeNull();
    });

    test('handles rapid filter changes', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.unsetFilter('hawker');
        result.current.setFilter('hawker');
        result.current.unsetFilter('restaurant');
        result.current.setFilter('restaurant');
        result.current.unsetFilter('dessert');
        result.current.setFilter('dessert');
      });

      const filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(6); // All filters should be active
    });

    test('handles data update while item is selected', () => {
      const { result } = renderHook(() => useHeritageStore());

      act(() => {
        result.current.setFoodData(comprehensiveMockData);
        result.current.setHeritageId('hawker-central-1');
      });

      // Update data with new items
      const newData = [...comprehensiveMockData, {
        id: 'hawker-north-1',
        name: 'North Hawker',
        category: 'hawker' as const,
        recommendations: ['Nasi Lemak'],
        imgSource: ['north1.jpg'],
        location: {
          address: 'North Point',
          gmapUrl: 'https://maps.google.com',
          mrt: ['Yishun'],
          region: 'north' as const,
          geoLocation: { latitude: 1.43, longitude: 103.84 },
        },
      }];

      act(() => {
        result.current.setFoodData(newData);
      });

      // Selection should remain valid
      expect(result.current.heritageId).toBe('hawker-central-1');
      const selected = result.current.getSelectedFoodData();
      expect(selected).not.toBeNull();

      // New item should be in filtered results
      const filtered = result.current.getFilteredFood();
      expect(filtered).toHaveLength(7);
    });
  });
});
