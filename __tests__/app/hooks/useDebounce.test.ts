import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/app/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  test('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by delay amount
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe('updated');
  });

  test('cancels previous timeout on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'first', delay: 500 },
      }
    );

    expect(result.current).toBe('first');

    // First update
    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Second update before first timeout completes
    rerender({ value: 'third', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Value should still be 'first' (not 'second')
    expect(result.current).toBe('first');

    // Fast-forward remaining time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now value should be 'third' (skipped 'second')
    expect(result.current).toBe('third');
  });

  test('works with different data types - number', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 300 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  test('works with different data types - boolean', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: false, delay: 300 },
      }
    );

    expect(result.current).toBe(false);

    rerender({ value: true, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(true);
  });

  test('works with different data types - object', () => {
    const initialObj = { name: 'John', age: 30 };
    const updatedObj = { name: 'Jane', age: 25 };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 300 },
      }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedObj);
  });

  test('works with different data types - array', () => {
    const initialArr = [1, 2, 3];
    const updatedArr = [4, 5, 6];

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialArr, delay: 300 },
      }
    );

    expect(result.current).toBe(initialArr);

    rerender({ value: updatedArr, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedArr);
  });

  test('handles delay value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    );

    // Change both value and delay
    rerender({ value: 'updated', delay: 1000 });

    // Advance by original delay (500ms) - should not update yet
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('test');

    // Advance by new delay (1000ms total)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  test('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'updated', delay: 500 });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  test('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    );

    rerender({ value: 'updated', delay: 0 });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  test('handles undefined value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: undefined, delay: 300 },
      }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 'defined', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('defined');
  });

  test('handles null value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: null, delay: 300 },
      }
    );

    expect(result.current).toBeNull();

    rerender({ value: 'not null', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('not null');
  });

  test('multiple rapid changes only update to final value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'v1', delay: 500 },
      }
    );

    // Rapid changes
    rerender({ value: 'v2', delay: 500 });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'v3', delay: 500 });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'v4', delay: 500 });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'v5', delay: 500 });

    // Still should be initial value
    expect(result.current).toBe('v1');

    // Wait for the full delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should skip to the final value
    expect(result.current).toBe('v5');
  });
});
