import { useRef } from 'react';
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

  /* -------------------- Location Focus with Eye-Level View ------------------- */
  // For selecting food locations - moves camera AND target with offset
  function focusOnLocation(
    targetPos: THREE.Vector3,
    duration = 1,
    horizontalDistance = 50,
    eyeHeight = 30,
    lookAtHeight = 5,
  ) {
    if (!camera || !controls) return;

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    // Calculate horizontal direction from current camera
    const horizontalDirection = new THREE.Vector3(
      startPos.x - targetPos.x,
      0,
      startPos.z - targetPos.z,
    ).normalize();

    // If direction is zero (directly above), use a default direction
    if (horizontalDirection.length() === 0) {
      horizontalDirection.set(1, 0, 0); // Default to looking from east
    }

    // Position camera at eye-level, looking horizontally
    const finalCameraPos = new THREE.Vector3(
      targetPos.x + horizontalDirection.x * horizontalDistance,
      targetPos.y + eyeHeight,
      targetPos.z + horizontalDirection.z * horizontalDistance,
    );

    // Look at target slightly above ground level
    const finalTarget = new THREE.Vector3(targetPos.x, targetPos.y + lookAtHeight, targetPos.z);

    const start = performance.now();

    function step() {
      if (!camera || !controls) return;
      const elapsed = (performance.now() - start) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const eased = t * (2 - t);

      camera.position.lerpVectors(startPos, finalCameraPos, eased);
      controls.target.lerpVectors(startTarget, finalTarget, eased);
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

    focusOnLocation,
    startHold,
    stopHold,
  };
}
