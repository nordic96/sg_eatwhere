import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { MapControls } from 'three-stdlib';
import {
  PanControl,
  RotationControl,
  VerticalRotation,
  ZoomControls,
} from '../components/MapController/types';

export default function useCameraControls(
  controls: MapControls | null,
  camera: THREE.Camera | null,
) {
  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const lastPinchDistance = useRef<number | null>(null);
  const lastTwoFingerPos = useRef<{ x: number; y: number } | null>(null);

  /* ---------------------------- Animation Helper ---------------------------- */
  function animateTo(targetPos: THREE.Vector3, duration = 0.25) {
    if (!camera || !controls) return;

    const startPos = camera.position.clone();
    const start = performance.now();

    function step() {
      if (!camera || !controls) return;
      const elapsed = (performance.now() - start) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const eased = t * (2 - t); // ease out

      camera.position.lerpVectors(startPos, targetPos, eased);
      camera.lookAt(controls.target);
      controls.update();

      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ------------------------------ PAN (WORLD) ------------------------------ */
  function pan(direction: PanControl) {
    if (!camera || !controls) return;

    const distance = 4;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const targetPos = camera.position.clone();

    if (direction === 'up') targetPos.addScaledVector(forward, distance);
    if (direction === 'down') targetPos.addScaledVector(forward, -distance);
    if (direction === 'left') targetPos.addScaledVector(right, -distance);
    if (direction === 'right') targetPos.addScaledVector(right, distance);

    animateTo(targetPos);
  }

  /* ------------------------- HORIZONTAL ROTATION -------------------------- */
  function rotateHorizontal(direction: RotationControl) {
    if (!camera || !controls) return;

    const angle = direction === 'rLeft' ? -0.3 : 0.3;

    const target = controls.target.clone();
    const offset = camera.position.clone().sub(target);

    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);

    const newPos = target.clone().add(offset);
    animateTo(newPos);
  }

  /* --------------------------- VERTICAL ROTATION --------------------------- */
  function rotateVertical(direction: VerticalRotation) {
    if (!camera || !controls) return;

    const target = controls.target.clone();
    const offset = camera.position.clone().sub(target);

    const spherical = new THREE.Spherical().setFromVector3(offset);

    const delta = direction === 'rUp' ? -0.15 : 0.15;

    const minPhi = controls.minPolarAngle ?? Math.PI / 6;
    const maxPhi = controls.maxPolarAngle ?? Math.PI / 2.2;

    spherical.phi = THREE.MathUtils.clamp(spherical.phi + delta, minPhi, maxPhi);

    const newPos = new THREE.Vector3().setFromSpherical(spherical).add(target);
    animateTo(newPos);
  }

  /* ---------------------------------- ZOOM --------------------------------- */
  function zoom(direction: ZoomControls) {
    if (!camera || !controls) return;

    const zoomFactor = direction === 'zoomIn' ? 0.9 : 1.1;

    const offset = camera.position.clone().sub(controls.target).multiplyScalar(zoomFactor);
    const newPos = controls.target.clone().add(offset);

    animateTo(newPos);
  }

  /* ------------------------------ Hold Logic ------------------------------- */
  function startHold(action: () => void) {
    action();
    holdInterval.current = setInterval(action, 80);
  }

  function stopHold() {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
  }

  /* -------------------------- Touch Gesture Support ------------------------ */
  function handleTouchGesture(e: TouchEvent) {
    if (!camera || !controls) return;

    // Pinch-to-zoom (two fingers)
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastPinchDistance.current !== null) {
        const delta = distance - lastPinchDistance.current;
        if (Math.abs(delta) > 5) {
          const zoomFactor = delta > 0 ? 0.98 : 1.02;
          const offset = camera.position.clone().sub(controls.target).multiplyScalar(zoomFactor);
          const newPos = controls.target.clone().add(offset);
          camera.position.copy(newPos);
          controls.update();
        }
      }

      lastPinchDistance.current = distance;

      // Two-finger rotation
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      if (lastTwoFingerPos.current) {
        const deltaX = centerX - lastTwoFingerPos.current.x;
        const angle = deltaX * 0.005;

        const target = controls.target.clone();
        const offset = camera.position.clone().sub(target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        const newPos = target.clone().add(offset);
        camera.position.copy(newPos);
        controls.update();
      }

      lastTwoFingerPos.current = { x: centerX, y: centerY };
    }
  }

  function handleTouchEnd() {
    lastPinchDistance.current = null;
    lastTwoFingerPos.current = null;
  }

  /* ----------------------- Preset Camera Views ------------------------- */
  function setTopView() {
    if (!camera || !controls) return;
    const targetPos = new THREE.Vector3(0, 80, 0.1);
    animateTo(targetPos, 0.5);
  }

  function resetView() {
    if (!camera || !controls) return;
    const targetPos = new THREE.Vector3(0, 70, 8);
    animateTo(targetPos, 0.5);
  }

  function triggerHaptic() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('touchmove', handleTouchGesture, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchmove', handleTouchGesture);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, controls]);

  return {
    panUp: () => pan('up'),
    panDown: () => pan('down'),
    panLeft: () => pan('left'),
    panRight: () => pan('right'),

    rotateLeft: () => rotateHorizontal('rLeft'),
    rotateRight: () => rotateHorizontal('rRight'),
    rotateUp: () => rotateVertical('rUp'),
    rotateDown: () => rotateVertical('rDown'),

    zoomIn: () => zoom('zoomIn'),
    zoomOut: () => zoom('zoomOut'),

    startHold,
    stopHold,

    // New mobile-specific methods
    setTopView,
    resetView,
    triggerHaptic,
  };
}
