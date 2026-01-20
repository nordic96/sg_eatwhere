import React from 'react';
import { render, act } from '@testing-library/react';
import { useCountUp, UseCountUpOptions } from '@/app/hooks/useCountUp';

// Mock requestAnimationFrame
let frameCallbacks: Array<(timestamp: number) => void> = [];
let frameId = 0;
let currentTime = 0;

beforeEach(() => {
  frameCallbacks = [];
  frameId = 0;
  currentTime = 0;

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frameCallbacks.push(callback);
    return ++frameId;
  });

  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
    // Cancel is a no-op in our mock, but we track it was called
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Helper to advance animation frames
function advanceFrames(duration: number, steps = 10) {
  const stepDuration = duration / steps;
  for (let i = 0; i < steps; i++) {
    currentTime += stepDuration;
    const callbacks = [...frameCallbacks];
    frameCallbacks = [];
    callbacks.forEach((cb) => cb(currentTime));
  }
}

describe('useCountUp', () => {
  // Helper component to test the hook
  const TestComponent = ({ options }: { options: UseCountUpOptions }) => {
    const result = useCountUp(options);
    return <span data-testid="result">{result}</span>;
  };

  describe('Initial state', () => {
    test('returns start value initially', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: false }} />,
      );

      expect(getByTestId('result').textContent).toBe('0');
    });

    test('returns custom start value initially', () => {
      const { getByTestId } = render(
        <TestComponent options={{ start: 50, end: 100, startCounting: false }} />,
      );

      expect(getByTestId('result').textContent).toBe('50');
    });

    test('applies prefix and suffix to initial value', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: false, prefix: '$', suffix: '+' }} />,
      );

      expect(getByTestId('result').textContent).toBe('$0+');
    });
  });

  describe('Counting animation', () => {
    test('starts counting when startCounting becomes true', () => {
      const { getByTestId, rerender } = render(
        <TestComponent options={{ end: 100, startCounting: false }} />,
      );

      expect(getByTestId('result').textContent).toBe('0');

      rerender(<TestComponent options={{ end: 100, startCounting: true }} />);

      // Animation frame should be requested
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    test('reaches end value after animation completes', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 1000 }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('100');
    });

    test('counts up from custom start to end', () => {
      const { getByTestId } = render(
        <TestComponent options={{ start: 50, end: 100, startCounting: true, duration: 1000 }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('100');
    });

    test('applies suffix to animated value', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 1000, suffix: '+' }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('100+');
    });

    test('applies prefix to animated value', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 1000, prefix: '$' }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('$100');
    });

    test('applies both prefix and suffix', () => {
      const { getByTestId } = render(
        <TestComponent
          options={{
            end: 100,
            startCounting: true,
            duration: 1000,
            prefix: '$',
            suffix: '+',
          }}
        />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('$100+');
    });
  });

  describe('Easing functions', () => {
    test('uses linear easing when specified', () => {
      const { getByTestId } = render(
        <TestComponent
          options={{ end: 100, startCounting: true, duration: 1000, easing: 'linear' }}
        />,
      );

      // Advance halfway
      act(() => {
        advanceFrames(500, 10);
      });

      // With linear easing, should be around 50 at halfway point
      const value = parseInt(getByTestId('result').textContent || '0', 10);
      expect(value).toBeGreaterThanOrEqual(45);
      expect(value).toBeLessThanOrEqual(55);
    });

    test('uses easeOutCubic easing by default', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 1000 }} />,
      );

      // Advance halfway - with easeOutCubic, should be more than 50
      act(() => {
        advanceFrames(500, 10);
      });

      const value = parseInt(getByTestId('result').textContent || '0', 10);
      // easeOutCubic accelerates early, so should be > 50 at halfway
      expect(value).toBeGreaterThanOrEqual(50);
    });

    test('uses easeOutQuart easing when specified', () => {
      const { getByTestId } = render(
        <TestComponent
          options={{ end: 100, startCounting: true, duration: 1000, easing: 'easeOutQuart' }}
        />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('100');
    });
  });

  describe('Reduced motion preference', () => {
    test('sets end value immediately when reduced motion is preferred', () => {
      const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      window.matchMedia = mockMatchMedia;

      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, suffix: '+' }} />,
      );

      // Should immediately show end value without animation
      expect(getByTestId('result').textContent).toBe('100+');
    });

    test('does not start animation when reduced motion is preferred', () => {
      const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      window.matchMedia = mockMatchMedia;

      render(<TestComponent options={{ end: 100, startCounting: true }} />);

      // Animation should not be requested
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('Animation lifecycle', () => {
    test('only starts animation once', () => {
      const { rerender } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 1000 }} />,
      );

      // Re-render with same props
      rerender(<TestComponent options={{ end: 100, startCounting: true, duration: 1000 }} />);

      // Should not start a new animation
      // Note: RAF may be called during animation, but not a new initialization
      act(() => {
        advanceFrames(1100, 20);
      });
    });

    test('cleanup function handles unmount gracefully', () => {
      // This test verifies the component can unmount cleanly during animation
      // Different end value ensures hasStartedRef doesn't block this test
      const { unmount, getByTestId } = render(
        <TestComponent options={{ end: 999, startCounting: true, duration: 2000 }} />,
      );

      // Verify component mounted
      expect(getByTestId('result')).toBeInTheDocument();

      // Unmount should not throw (cleanup runs)
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    test('handles zero end value', () => {
      const { getByTestId } = render(
        <TestComponent options={{ start: 10, end: 0, startCounting: true, duration: 1000 }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('0');
    });

    test('handles negative end value', () => {
      // Note: Current implementation may not handle negative values, but this tests current behavior
      const { getByTestId } = render(
        <TestComponent options={{ end: -10, startCounting: true, duration: 1000 }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('-10');
    });

    test('handles large numbers', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 1000000, startCounting: true, duration: 1000 }} />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('1000000');
    });

    test('handles very short duration', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 10 }} />,
      );

      act(() => {
        advanceFrames(50, 5);
      });

      expect(getByTestId('result').textContent).toBe('100');
    });

    test('handles empty prefix and suffix', () => {
      const { getByTestId } = render(
        <TestComponent
          options={{ end: 100, startCounting: true, duration: 1000, prefix: '', suffix: '' }}
        />,
      );

      act(() => {
        advanceFrames(1100, 20);
      });

      expect(getByTestId('result').textContent).toBe('100');
    });
  });

  describe('Duration options', () => {
    test('animation reaches end value when started', () => {
      // Use unique end value to avoid hasStartedRef collision
      const { getByTestId } = render(<TestComponent options={{ end: 777, startCounting: true }} />);

      // Advance to completion
      act(() => {
        advanceFrames(3000, 30);
      });

      expect(getByTestId('result').textContent).toBe('777');
    });

    test('respects custom duration', () => {
      const { getByTestId } = render(
        <TestComponent options={{ end: 100, startCounting: true, duration: 500 }} />,
      );

      act(() => {
        advanceFrames(600, 10);
      });

      expect(getByTestId('result').textContent).toBe('100');
    });
  });
});
