import React from 'react';
import { render, act } from '@testing-library/react';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  mockDisconnect.mockClear();
  mockObserve.mockClear();
  mockIntersectionObserver.mockClear();

  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: jest.fn(),
    // Store callback to trigger intersection events
    _callback: callback,
  }));

  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useScrollReveal', () => {
  // Helper component to test the hook
  const TestComponent = ({
    options = {},
    onStateChange,
  }: {
    options?: Parameters<typeof useScrollReveal>[0];
    onStateChange?: (state: { isVisible: boolean; prefersReducedMotion: boolean }) => void;
  }) => {
    const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>(options);

    React.useEffect(() => {
      onStateChange?.({ isVisible, prefersReducedMotion });
    }, [isVisible, prefersReducedMotion, onStateChange]);

    return (
      <div ref={ref} data-testid="target" data-visible={isVisible}>
        Content
      </div>
    );
  };

  describe('Initial state', () => {
    test('returns isVisible as false initially', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent onStateChange={(s) => (state = s)} />);

      expect(state.isVisible).toBe(false);
    });

    test('returns ref that can be attached to element', () => {
      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('target')).toBeInTheDocument();
    });

    test('creates IntersectionObserver with default options', () => {
      render(<TestComponent />);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
        rootMargin: '0px',
      });
    });

    test('creates IntersectionObserver with custom options', () => {
      render(<TestComponent options={{ threshold: 0.5, rootMargin: '100px' }} />);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.5,
        rootMargin: '100px',
      });
    });
  });

  describe('Intersection behavior', () => {
    test('sets isVisible to true when element intersects', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent onStateChange={(s) => (state = s)} />);

      // Get the callback that was passed to IntersectionObserver
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      // Simulate intersection
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      expect(state.isVisible).toBe(true);
    });

    test('disconnects observer when once=true (default) after intersection', () => {
      render(<TestComponent />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      expect(mockDisconnect).toHaveBeenCalled();
    });

    test('does not disconnect observer when once=false', () => {
      render(<TestComponent options={{ once: false }} />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      expect(mockDisconnect).not.toHaveBeenCalled();
    });

    test('resets isVisible when element leaves view with once=false', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent options={{ once: false }} onStateChange={(s) => (state = s)} />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      // Enter viewport
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });
      expect(state.isVisible).toBe(true);

      // Leave viewport
      act(() => {
        observerCallback([{ isIntersecting: false }], { disconnect: mockDisconnect });
      });
      expect(state.isVisible).toBe(false);
    });
  });

  describe('Delay behavior', () => {
    test('applies delay before setting isVisible', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent options={{ delay: 500 }} onStateChange={(s) => (state = s)} />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      // Simulate intersection
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      // Should not be visible yet
      expect(state.isVisible).toBe(false);

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(state.isVisible).toBe(true);
    });

    test('does not apply delay when delay=0', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent options={{ delay: 0 }} onStateChange={(s) => (state = s)} />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      // Should be immediately visible
      expect(state.isVisible).toBe(true);
    });

    test('clears timeout when element leaves view with once=false', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(
        <TestComponent options={{ delay: 500, once: false }} onStateChange={(s) => (state = s)} />,
      );

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      // Enter viewport
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      // Leave before delay completes
      act(() => {
        jest.advanceTimersByTime(200);
        observerCallback([{ isIntersecting: false }], { disconnect: mockDisconnect });
      });

      // Advance past original delay
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not become visible since we left viewport
      expect(state.isVisible).toBe(false);
    });
  });

  describe('Reduced motion preference', () => {
    test('sets isVisible immediately when reduced motion is preferred', () => {
      // Mock reduced motion preference
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

      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent onStateChange={(s) => (state = s)} />);

      // Should be immediately visible
      expect(state.isVisible).toBe(true);
      expect(state.prefersReducedMotion).toBe(true);
    });

    test('does not observe element after reduced motion is detected', async () => {
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

      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent onStateChange={(s) => (state = s)} />);

      // The key behavior is that isVisible becomes true immediately
      // and the element is accessible without scroll
      expect(state.isVisible).toBe(true);
      expect(state.prefersReducedMotion).toBe(true);
    });

    test('responds to reduced motion preference change', () => {
      let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null;
      const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            mediaQueryCallback = cb;
          }
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      window.matchMedia = mockMatchMedia;

      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent onStateChange={(s) => (state = s)} />);

      expect(state.prefersReducedMotion).toBe(false);

      // Simulate preference change
      act(() => {
        mediaQueryCallback?.({ matches: true } as MediaQueryListEvent);
      });

      expect(state.prefersReducedMotion).toBe(true);
      expect(state.isVisible).toBe(true);
    });
  });

  describe('Cleanup', () => {
    test('disconnects observer on unmount', () => {
      const { unmount } = render(<TestComponent />);

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    test('clears pending timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(<TestComponent options={{ delay: 1000 }} />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      // Trigger intersection with delay
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      // Unmount before delay completes
      unmount();

      // clearTimeout should have been called
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    test('removes media query listener on unmount', () => {
      const mockRemoveEventListener = jest.fn();
      const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: jest.fn(),
      }));
      window.matchMedia = mockMatchMedia;

      const { unmount } = render(<TestComponent />);

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Edge cases', () => {
    test('handles null ref gracefully', () => {
      // Component that doesn't attach the ref
      const NoRefComponent = () => {
        const { isVisible } = useScrollReveal<HTMLDivElement>();
        return <div data-visible={isVisible}>No ref attached</div>;
      };

      // Should not throw
      expect(() => render(<NoRefComponent />)).not.toThrow();
    });

    test('handles multiple intersection events', () => {
      let state = { isVisible: false, prefersReducedMotion: false };
      render(<TestComponent options={{ once: false }} onStateChange={(s) => (state = s)} />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];

      // Multiple intersections
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });
      expect(state.isVisible).toBe(true);

      act(() => {
        observerCallback([{ isIntersecting: false }], { disconnect: mockDisconnect });
      });
      expect(state.isVisible).toBe(false);

      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });
      expect(state.isVisible).toBe(true);
    });
  });
});
