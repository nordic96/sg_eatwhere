import { generateRandomArr } from '@/app/utils/randomUtils';

describe('randomUtils', () => {
  describe('generateRandomArr', () => {
    test('returns the same array when m equals n', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = generateRandomArr(arr, 5);

      expect(result).toEqual(arr);
      expect(result.length).toBe(5);
    });

    test('returns subset of correct size when m < n', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = generateRandomArr(arr, 5);

      expect(result.length).toBe(5);
      // All elements should be from original array
      result.forEach(item => {
        expect(arr).toContain(item);
      });
    });

    test('returns unique elements (no duplicates)', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = generateRandomArr(arr, 5);

      const uniqueResult = [...new Set(result)];
      expect(uniqueResult.length).toBe(result.length);
    });

    test('handles m greater than n (should return at most n elements)', () => {
      const arr = [1, 2, 3];
      const result = generateRandomArr(arr, 10);

      expect(result.length).toBe(3);
      expect(result.sort()).toEqual([1, 2, 3].sort());
    });

    test('handles empty array', () => {
      const arr: number[] = [];
      const result = generateRandomArr(arr, 5);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('handles m = 0', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = generateRandomArr(arr, 0);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('handles single element array', () => {
      const arr = [42];
      const result = generateRandomArr(arr, 1);

      expect(result).toEqual([42]);
    });

    test('works with different types (strings)', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const result = generateRandomArr(arr, 3);

      expect(result.length).toBe(3);
      result.forEach(item => {
        expect(arr).toContain(item);
      });
    });

    test('works with objects', () => {
      const arr = [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
      ];
      const result = generateRandomArr(arr, 2);

      expect(result.length).toBe(2);
      result.forEach(item => {
        expect(arr).toContain(item);
      });
    });

    test('randomness: multiple calls produce different results', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set();

      // Generate 10 random selections
      for (let i = 0; i < 10; i++) {
        const result = generateRandomArr(arr, 5);
        results.add(result.join(','));
      }

      // With 10 tries selecting 5 from 10, we should get at least some variation
      // This is probabilistic but very likely to pass
      expect(results.size).toBeGreaterThan(1);
    });
  });
});
