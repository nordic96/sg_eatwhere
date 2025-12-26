import { fetchApi } from '@/app/utils/networkUtils';
import { AppResponse } from '@/app/types';

// Mock the global fetch function
global.fetch = jest.fn();

describe('networkUtils', () => {
  describe('fetchApi', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('successfully fetches data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<typeof mockData>('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        cache: 'no-store',
      });
      expect(result).toEqual(mockData);
    });

    test('uses no-store cache option', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await fetchApi('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        cache: 'no-store',
      });
    });

    test('handles fetch errors with Error instance', async () => {
      const mockError = new Error('Network error');
      const mockResponse = {
        json: jest.fn().mockRejectedValue(mockError),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<any>('/api/test');

      expect(result).toEqual({
        data: null,
        error: 'Network error',
      });
    });

    test('handles non-Error exceptions', async () => {
      const mockResponse = {
        json: jest.fn().mockRejectedValue('String error'),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<any>('/api/test');

      // When error is not an Error instance, it returns undefined from catch block
      // which gets cast to AppResponse<T>
      expect(result).toBeUndefined();
    });

    test('handles JSON parsing errors', async () => {
      const mockError = new Error('Invalid JSON');
      const mockResponse = {
        json: jest.fn().mockRejectedValue(mockError),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<any>('/api/test');

      expect(result).toEqual({
        data: null,
        error: 'Invalid JSON',
      });
    });

    test('works with different URLs', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ success: true }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await fetchApi('/api/different-endpoint');

      expect(global.fetch).toHaveBeenCalledWith('/api/different-endpoint', {
        cache: 'no-store',
      });
    });

    test('returns typed data correctly', async () => {
      interface TestData {
        id: number;
        name: string;
        active: boolean;
      }

      const mockData: TestData = {
        id: 123,
        name: 'Test Item',
        active: true,
      };

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<TestData>('/api/typed');

      expect(result).toEqual(mockData);
      // TypeScript should understand the type
      if ('id' in result) {
        expect(result.id).toBe(123);
        expect(result.name).toBe('Test Item');
        expect(result.active).toBe(true);
      }
    });

    test('handles empty response', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue(null),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<any>('/api/empty');

      expect(result).toBeNull();
    });

    test('handles array response', async () => {
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<typeof mockData>('/api/array');

      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });

    test('handles fetch rejection (network failure)', async () => {
      const networkError = new Error('Failed to fetch');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      // When fetch rejects, the catch block handles it and returns error object
      const result = await fetchApi<any>('/api/test');

      expect(result).toEqual({
        data: null,
        error: 'Failed to fetch',
      });
    });

    test('handles timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      const mockResponse = {
        json: jest.fn().mockRejectedValue(timeoutError),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchApi<any>('/api/slow');

      expect(result).toEqual({
        data: null,
        error: 'Request timeout',
      });
    });

    test('processes response JSON only once', async () => {
      const mockJson = jest.fn().mockResolvedValue({ data: 'test' });
      const mockResponse = { json: mockJson };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await fetchApi<any>('/api/test');

      expect(mockJson).toHaveBeenCalledTimes(1);
    });

    test('calls fetch only once per request', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await fetchApi<any>('/api/test');

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
