import React, { useRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import useClickOutside from '@/app/hooks/useClickOutside';

describe('useClickOutside', () => {
  test('calls handler when clicking outside the element', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside Element
          </div>
          <div data-testid="outside">Outside Element</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    act(() => {
      fireEvent.mouseDown(getByTestId('outside'));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('does not call handler when clicking inside the element', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside Element
          </div>
          <div data-testid="outside">Outside Element</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    act(() => {
      fireEvent.mouseDown(getByTestId('inside'));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test('works with touchstart event', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler, 'touchstart');

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside Element
          </div>
          <div data-testid="outside">Outside Element</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    act(() => {
      fireEvent.touchStart(getByTestId('outside'));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('does not call handler for touchstart inside element', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler, 'touchstart');

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside Element
          </div>
          <div data-testid="outside">Outside Element</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    act(() => {
      fireEvent.touchStart(getByTestId('inside'));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test('handler receives the event object', () => {
    let capturedEvent: any = null;
    const handler = (event: MouseEvent | TouchEvent | FocusEvent) => {
      capturedEvent = event;
    };

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside
          </div>
          <div data-testid="outside">Outside</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    act(() => {
      fireEvent.mouseDown(getByTestId('outside'));
    });

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent).toBeInstanceOf(Event);
  });

  test('does not call handler if target is not connected to DOM', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return (
        <div ref={ref} data-testid="inside">
          Inside Element
        </div>
      );
    };

    render(<TestComponent />);

    // Create a disconnected element
    const disconnectedElement = document.createElement('div');
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: disconnectedElement,
      writable: false,
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test('cleans up event listener on unmount', () => {
    const handler = jest.fn();
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return <div ref={ref}>Content</div>;
    };

    const { unmount } = render(<TestComponent />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined);

    removeEventListenerSpy.mockRestore();
  });

  test('updates to new handler without re-registering listener', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const TestComponent = ({ handler }: { handler: (e: any) => void }) => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return (
        <div>
          <div ref={ref} data-testid="inside">
            Inside
          </div>
          <div data-testid="outside">Outside</div>
        </div>
      );
    };

    const { getByTestId, rerender } = render(<TestComponent handler={handler1} />);

    // Click outside with first handler
    act(() => {
      fireEvent.mouseDown(getByTestId('outside'));
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    // Update to second handler
    rerender(<TestComponent handler={handler2} />);

    // Click outside with second handler
    act(() => {
      fireEvent.mouseDown(getByTestId('outside'));
    });

    expect(handler1).toHaveBeenCalledTimes(1); // Still only called once
    expect(handler2).toHaveBeenCalledTimes(1); // Now called with new handler
  });

  test('works with nested elements', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      return (
        <div>
          <div ref={ref} data-testid="parent">
            <div data-testid="child">
              <span data-testid="nested">Nested</span>
            </div>
          </div>
          <div data-testid="outside">Outside</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    // Click on nested child - should not trigger handler
    act(() => {
      fireEvent.mouseDown(getByTestId('nested'));
    });
    expect(handler).not.toHaveBeenCalled();

    // Click on direct child - should not trigger handler
    act(() => {
      fireEvent.mouseDown(getByTestId('child'));
    });
    expect(handler).not.toHaveBeenCalled();

    // Click outside - should trigger handler
    act(() => {
      fireEvent.mouseDown(getByTestId('outside'));
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('handles null ref gracefully', () => {
    const handler = jest.fn();

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);

      // Don't attach ref to anything
      return (
        <div>
          <div data-testid="outside">Outside</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    // Should not crash when ref is null
    act(() => {
      fireEvent.mouseDown(getByTestId('outside'));
    });

    // Handler should NOT be called when ref.current is null (no element to check outside of)
    expect(handler).not.toHaveBeenCalled();
  });

  test('respects custom event listener options', () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler, 'mousedown', { capture: true, passive: true });

      return <div ref={ref}>Content</div>;
    };

    render(<TestComponent />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
      { capture: true, passive: true }
    );

    addEventListenerSpy.mockRestore();
  });
});
