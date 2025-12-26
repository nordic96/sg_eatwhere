import { calculateEnvironment, EnvironmentState } from '@/app/utils/calcEnvironment';

describe('calcEnvironment', () => {
  describe('calculateEnvironment', () => {
    // Mock Date to control time-based tests
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('returns correct structure', () => {
      const result = calculateEnvironment();

      expect(result).toHaveProperty('isDay');
      expect(result).toHaveProperty('isNight');
      expect(result).toHaveProperty('sunPosition');
      expect(result).toHaveProperty('moonPosition');
      expect(result).toHaveProperty('ambientIntensity');
      expect(result).toHaveProperty('sunIntensity');
    });

    test('sunPosition is a valid Vector3Tuple', () => {
      const result = calculateEnvironment();

      expect(Array.isArray(result.sunPosition)).toBe(true);
      expect(result.sunPosition.length).toBe(3);
      expect(typeof result.sunPosition[0]).toBe('number');
      expect(typeof result.sunPosition[1]).toBe('number');
      expect(typeof result.sunPosition[2]).toBe('number');
    });

    test('moonPosition is a valid Vector3Tuple', () => {
      const result = calculateEnvironment();

      expect(Array.isArray(result.moonPosition)).toBe(true);
      expect(result.moonPosition.length).toBe(3);
      expect(typeof result.moonPosition[0]).toBe('number');
      expect(typeof result.moonPosition[1]).toBe('number');
      expect(typeof result.moonPosition[2]).toBe('number');
    });

    test('isDay is true during daytime (6:00-17:59)', () => {
      // Test at 12:00 Singapore time (noon)
      const date = new Date('2024-01-01T12:00:00');
      jest.setSystemTime(date);

      // Mock toLocaleString to return 12 for Singapore timezone
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('12');

      const result = calculateEnvironment();

      expect(result.isDay).toBe(true);
      expect(result.isNight).toBe(false);

      mockToLocaleString.mockRestore();
    });

    test('isNight is true during nighttime (18:00-5:59)', () => {
      // Test at 22:00 Singapore time (night)
      const date = new Date('2024-01-01T22:00:00');
      jest.setSystemTime(date);

      // Mock toLocaleString to return 22 for Singapore timezone
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('22');

      const result = calculateEnvironment();

      expect(result.isDay).toBe(false);
      expect(result.isNight).toBe(true);

      mockToLocaleString.mockRestore();
    });

    test('daytime has higher ambient intensity', () => {
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('12'); // noon

      const result = calculateEnvironment();

      expect(result.ambientIntensity).toBe(2.5);
      expect(result.sunIntensity).toBe(1.1);

      mockToLocaleString.mockRestore();
    });

    test('nighttime has lower ambient intensity', () => {
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('22'); // night

      const result = calculateEnvironment();

      expect(result.ambientIntensity).toBe(0.25);
      expect(result.sunIntensity).toBe(0.05);

      mockToLocaleString.mockRestore();
    });

    test('boundary case: 6:00 is daytime', () => {
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('6');

      const result = calculateEnvironment();

      expect(result.isDay).toBe(true);
      expect(result.isNight).toBe(false);

      mockToLocaleString.mockRestore();
    });

    test('boundary case: 18:00 is nighttime', () => {
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('18');

      const result = calculateEnvironment();

      expect(result.isDay).toBe(false);
      expect(result.isNight).toBe(true);

      mockToLocaleString.mockRestore();
    });

    test('boundary case: 5:00 is nighttime', () => {
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('5');

      const result = calculateEnvironment();

      expect(result.isDay).toBe(false);
      expect(result.isNight).toBe(true);

      mockToLocaleString.mockRestore();
    });

    test('boundary case: 17:00 is daytime', () => {
      const mockToLocaleString = jest.spyOn(Date.prototype, 'toLocaleString');
      mockToLocaleString.mockReturnValue('17');

      const result = calculateEnvironment();

      expect(result.isDay).toBe(true);
      expect(result.isNight).toBe(false);

      mockToLocaleString.mockRestore();
    });

    test('sun and moon positions are opposite', () => {
      const result = calculateEnvironment();

      // Moon and sun should be in generally opposite positions
      // This is a general check that they're not identical
      expect(result.sunPosition).not.toEqual(result.moonPosition);
    });

    test('isDay and isNight are mutually exclusive', () => {
      const result = calculateEnvironment();

      // One should be true, the other false
      expect(result.isDay).not.toBe(result.isNight);
      expect(result.isDay || result.isNight).toBe(true);
    });

    test('sunPosition z-coordinate is -20', () => {
      const result = calculateEnvironment();

      expect(result.sunPosition[2]).toBe(-20);
    });

    test('moonPosition z-coordinate is 20', () => {
      const result = calculateEnvironment();

      expect(result.moonPosition[2]).toBe(20);
    });
  });
});
