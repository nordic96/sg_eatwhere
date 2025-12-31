import { getGmapUrl, isProductionMode, isTrailMode, isUsingTestData } from '@/app/utils/devUtils';

describe('devUtils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('isProductionMode', () => {
    test('returns true when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      expect(isProductionMode()).toBe(true);
    });

    test('returns false when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isProductionMode()).toBe(false);
    });

    test('returns false when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      expect(isProductionMode()).toBe(false);
    });

    test('returns false when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      expect(isProductionMode()).toBe(false);
    });

    test('returns false for other NODE_ENV values', () => {
      process.env.NODE_ENV = 'staging';
      expect(isProductionMode()).toBe(false);
    });
  });

  describe('isTrailMode', () => {
    test('returns true when TRAIL_MODE is "true"', () => {
      process.env.TRAIL_MODE = 'true';
      expect(isTrailMode()).toBe(true);
    });

    test('returns false when TRAIL_MODE is "false"', () => {
      process.env.TRAIL_MODE = 'false';
      expect(isTrailMode()).toBe(false);
    });

    test('returns false when TRAIL_MODE is not set', () => {
      delete process.env.TRAIL_MODE;
      expect(isTrailMode()).toBe(false);
    });

    test('returns false when TRAIL_MODE is "1"', () => {
      process.env.TRAIL_MODE = '1';
      expect(isTrailMode()).toBe(false);
    });

    test('returns false when TRAIL_MODE is "TRUE" (uppercase)', () => {
      process.env.TRAIL_MODE = 'TRUE';
      expect(isTrailMode()).toBe(false);
    });

    test('returns false for empty string', () => {
      process.env.TRAIL_MODE = '';
      expect(isTrailMode()).toBe(false);
    });
  });

  describe('isUsingTestData', () => {
    test('returns true when USE_TEST_DATA is "true"', () => {
      process.env.USE_TEST_DATA = 'true';
      expect(isUsingTestData()).toBe(true);
    });

    test('returns false when USE_TEST_DATA is "false"', () => {
      process.env.USE_TEST_DATA = 'false';
      expect(isUsingTestData()).toBe(false);
    });

    test('returns false when USE_TEST_DATA is not set', () => {
      delete process.env.USE_TEST_DATA;
      expect(isUsingTestData()).toBe(false);
    });

    test('returns false when USE_TEST_DATA is "1"', () => {
      process.env.USE_TEST_DATA = '1';
      expect(isUsingTestData()).toBe(false);
    });

    test('returns false when USE_TEST_DATA is "TRUE" (uppercase)', () => {
      process.env.USE_TEST_DATA = 'TRUE';
      expect(isUsingTestData()).toBe(false);
    });

    test('returns false for empty string', () => {
      process.env.USE_TEST_DATA = '';
      expect(isUsingTestData()).toBe(false);
    });
  });

  describe('combined scenarios', () => {
    test('production mode with trail mode enabled', () => {
      process.env.NODE_ENV = 'production';
      process.env.TRAIL_MODE = 'true';

      expect(isProductionMode()).toBe(true);
      expect(isTrailMode()).toBe(true);
    });

    test('development mode with test data', () => {
      process.env.NODE_ENV = 'development';
      process.env.USE_TEST_DATA = 'true';

      expect(isProductionMode()).toBe(false);
      expect(isUsingTestData()).toBe(true);
    });

    test('all flags enabled', () => {
      process.env.NODE_ENV = 'production';
      process.env.TRAIL_MODE = 'true';
      process.env.USE_TEST_DATA = 'true';

      expect(isProductionMode()).toBe(true);
      expect(isTrailMode()).toBe(true);
      expect(isUsingTestData()).toBe(true);
    });

    test('all flags disabled', () => {
      process.env.NODE_ENV = 'development';
      process.env.TRAIL_MODE = 'false';
      process.env.USE_TEST_DATA = 'false';

      expect(isProductionMode()).toBe(false);
      expect(isTrailMode()).toBe(false);
      expect(isUsingTestData()).toBe(false);
    });
  });

  describe('getGmapUrl', () => {
    test('returns URL when GMAP_URL is set', () => {
      process.env.GMAP_URL = 'https://maps.google.com/test';
      expect(getGmapUrl()).toBe('https://maps.google.com/test');
    });

    test('returns undefined and warns when GMAP_URL is not set in development', () => {
      delete process.env.GMAP_URL;
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      expect(getGmapUrl()).toBeUndefined();
      expect(consoleWarnSpy).toHaveBeenCalledWith('GMAP_URL environment variable is not set');

      consoleWarnSpy.mockRestore();
    });
  });
});
