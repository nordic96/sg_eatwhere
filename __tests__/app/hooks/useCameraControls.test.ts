import { renderHook, act } from '@testing-library/react';
import useCameraControls from '@/app/hooks/useCameraControls';
import * as THREE from 'three';
import { MapControls } from 'three-stdlib';

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  cb(0);
  return 0;
});

describe('useCameraControls - focusOnLocation', () => {
  let camera: THREE.PerspectiveCamera;
  let controls: MapControls;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Create a mock canvas
    canvas = document.createElement('canvas');

    // Create camera
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(100, 100, 100);

    // Create controls
    controls = new MapControls(camera, canvas);
    controls.target.set(0, 0, 0);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('focusOnLocation is defined', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    expect(result.current.focusOnLocation).toBeDefined();
    expect(typeof result.current.focusOnLocation).toBe('function');
  });

  test('focusOnLocation accepts target position parameter', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);

    expect(() => {
      act(() => {
        result.current.focusOnLocation(targetPos);
      });
    }).not.toThrow();
  });

  test('focusOnLocation accepts optional duration parameter', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);

    expect(() => {
      act(() => {
        result.current.focusOnLocation(targetPos, 2);
      });
    }).not.toThrow();
  });

  test('focusOnLocation accepts optional distance parameters', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);

    expect(() => {
      act(() => {
        result.current.focusOnLocation(targetPos, 1, 100, 50, 10);
      });
    }).not.toThrow();
  });

  test('focusOnLocation does nothing when camera is null', () => {
    const { result } = renderHook(() => useCameraControls(controls, null));
    const targetPos = new THREE.Vector3(50, 0, 50);
    const initialTargetX = controls.target.x;

    act(() => {
      result.current.focusOnLocation(targetPos);
    });

    expect(controls.target.x).toBe(initialTargetX);
  });

  test('focusOnLocation does nothing when controls is null', () => {
    const { result } = renderHook(() => useCameraControls(null, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);
    const initialCameraX = camera.position.x;

    act(() => {
      result.current.focusOnLocation(targetPos);
    });

    expect(camera.position.x).toBe(initialCameraX);
  });

  test('focusOnLocation handles zero horizontal direction', () => {
    // Position camera directly above target
    camera.position.set(50, 100, 50);
    controls.target.set(50, 0, 50);

    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);

    expect(() => {
      act(() => {
        result.current.focusOnLocation(targetPos);
      });
    }).not.toThrow();
  });

  test('focusOnLocation with default parameters', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);
    const initialPos = camera.position.clone();

    act(() => {
      result.current.focusOnLocation(targetPos);
    });

    // Camera position should have changed
    expect(camera.position.equals(initialPos)).toBe(false);
  });

  test('focusOnLocation is stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useCameraControls(controls, camera));
    const firstFocusOnLocation = result.current.focusOnLocation;

    rerender();

    expect(result.current.focusOnLocation).toBe(firstFocusOnLocation);
  });

  test('focusOnLocation calculates correct horizontal direction', () => {
    camera.position.set(100, 50, 0);
    controls.target.set(0, 0, 0);

    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(0, 0, 0);

    act(() => {
      result.current.focusOnLocation(targetPos, 1, 50, 30, 5);
    });

    // Camera should be positioned based on horizontal direction
    expect(camera.position.y).toBeGreaterThan(0);
  });

  test('focusOnLocation sets controls target correctly', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(100, 0, 100);

    act(() => {
      result.current.focusOnLocation(targetPos, 1, 50, 30, 5);
    });

    // Controls target should be near the target position
    expect(controls.target.x).toBeCloseTo(targetPos.x, 0);
    expect(controls.target.z).toBeCloseTo(targetPos.z, 0);
  });

  test('focusOnLocation applies lookAtHeight parameter', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 10, 50);
    const lookAtHeight = 15;

    act(() => {
      result.current.focusOnLocation(targetPos, 1, 50, 30, lookAtHeight);
    });

    // Controls target Y should be targetPos.y + lookAtHeight
    expect(controls.target.y).toBeCloseTo(targetPos.y + lookAtHeight, 0);
  });

  test('focusOnLocation applies eyeHeight parameter', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 10, 50);
    const eyeHeight = 40;

    act(() => {
      result.current.focusOnLocation(targetPos, 1, 50, eyeHeight, 5);
    });

    // Camera Y position should be targetPos.y + eyeHeight
    expect(camera.position.y).toBeCloseTo(targetPos.y + eyeHeight, 0);
  });

  test('focusOnLocation applies horizontalDistance parameter', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(0, 0, 0);
    const horizontalDistance = 100;

    act(() => {
      result.current.focusOnLocation(targetPos, 1, horizontalDistance, 30, 5);
    });

    // Calculate horizontal distance from camera to target
    const dx = camera.position.x - targetPos.x;
    const dz = camera.position.z - targetPos.z;
    const actualDistance = Math.sqrt(dx * dx + dz * dz);

    expect(actualDistance).toBeCloseTo(horizontalDistance, 0);
  });

  test('focusOnLocation calls requestAnimationFrame', () => {
    const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(50, 0, 50);

    act(() => {
      result.current.focusOnLocation(targetPos);
    });

    expect(rafSpy).toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  test('focusOnLocation with different target positions', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const positions = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(100, 0, 100),
      new THREE.Vector3(-50, 10, -50),
      new THREE.Vector3(25, 5, 75),
    ];

    positions.forEach((targetPos) => {
      expect(() => {
        act(() => {
          result.current.focusOnLocation(targetPos);
        });
      }).not.toThrow();
    });
  });

  test('focusOnLocation handles negative coordinates', () => {
    const { result } = renderHook(() => useCameraControls(controls, camera));
    const targetPos = new THREE.Vector3(-100, -10, -100);

    expect(() => {
      act(() => {
        result.current.focusOnLocation(targetPos);
      });
    }).not.toThrow();

    expect(camera.position).toBeDefined();
    expect(controls.target).toBeDefined();
  });
});
