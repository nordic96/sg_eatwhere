import { useRef } from 'react';
import * as THREE from 'three';

import generateIcons from './generateIcons';
import { ControlType, PanControl, RotationControl, VerticalRotation, ZoomControls } from './types';
import { MapControllerProps } from './MapController';

type ControlButtonProps = MapControllerProps & {
  control: ControlType;
};

function animateCamera(
  camera: THREE.Camera,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controls: any, // MapControls instance
  to: THREE.Vector3,
  duration = 0.25,
) {
  const from = camera.position.clone();
  const start = performance.now();

  function update() {
    const elapsed = (performance.now() - start) / 1000;
    const t = Math.min(elapsed / duration, 1);
    const eased = t * (2 - t); // easeOutQuad-ish

    camera.position.lerpVectors(from, to, eased);
    camera.lookAt(controls.target);
    controls.update();

    if (t < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export const buttonStyle =
  'w-7 h-7 text-white bg-primary hover:bg-red-600 active:bg-red-600 rounded-lg flex justify-center items-center cursor-pointer';

export default function ControlButton({ control, controls, camera }: ControlButtonProps) {
  const holdInterval = useRef<NodeJS.Timeout | null>(null);

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

  function smoothPan(dir: PanControl) {
    const cam = camera.current;
    const ctrl = controls.current;
    if (!cam || !ctrl) return;

    const distance = 4;
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);

    forward.y = 0;
    forward.normalize();

    const right = forward.clone().cross(cam.up).normalize();

    const targetPos = cam.position.clone();

    if (dir === 'left') targetPos.addScaledVector(right, -distance);
    if (dir === 'right') targetPos.addScaledVector(right, distance);
    if (dir === 'up') targetPos.addScaledVector(forward, distance);
    if (dir === 'down') targetPos.addScaledVector(forward, -distance);

    animateCamera(cam, ctrl, targetPos);
  }

  function smoothRotateHorizontal(dir: RotationControl) {
    const cam = camera.current;
    const ctrl = controls.current;
    if (!cam || !ctrl) return;

    const angle = dir === 'rLeft' ? -0.3 : 0.3; // radians, tune to taste
    const target = ctrl.target.clone();
    const offset = cam.position.clone().sub(target);

    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);

    const newPos = target.clone().add(offset);
    animateCamera(cam, ctrl, newPos, 0.25);
  }

  function smoothRotateVertical(dir: VerticalRotation) {
    const cam = camera.current;
    const ctrl = controls.current;
    if (!cam || !ctrl) return;

    // get spherical coordinates around the controls target
    const target = ctrl.target.clone();
    const offset = cam.position.clone().sub(target);
    const sph = new THREE.Spherical().setFromVector3(offset);

    // decrease phi to rotate up (look more downward), increase to rotate down
    const deltaPhi = dir === 'rUp' ? -0.15 : 0.15; // tune sensitivity

    const minPhi = (ctrl.minPolarAngle as number) ?? Math.PI / 6; // default fallback
    const maxPhi = (ctrl.maxPolarAngle as number) ?? Math.PI / 2.2;

    // adjust phi and clamp
    sph.phi = THREE.MathUtils.clamp(sph.phi + deltaPhi, minPhi, maxPhi);

    // convert back and animate
    const newPos = new THREE.Vector3().setFromSpherical(sph).add(target);
    animateCamera(cam, ctrl, newPos, 0.25);
  }

  function zoom(direction: ZoomControls) {
    const cam = camera.current;
    const controlsInst = controls.current;
    if (!cam || !controlsInst) return;

    const zoomFactor = direction === 'zoomIn' ? 0.9 : 1.1;
    const offset = cam.position.clone().sub(controlsInst.target).multiplyScalar(zoomFactor);
    const newPos = controlsInst.target.clone().add(offset);

    animateCamera(cam, controlsInst, newPos);
  }

  function controlMovement(control: ControlType) {
    switch (control) {
      case 'left':
        smoothPan('left');
        break;
      case 'right':
        smoothPan('right');
        break;
      case 'up':
        smoothPan('up');
        break;
      case 'down':
        smoothPan('down');
        break;
      case 'rUp':
        smoothRotateVertical('rUp');
        break;
      case 'rDown':
        smoothRotateVertical('rDown');
        break;
      case 'rLeft':
        smoothRotateHorizontal('rLeft');
        break;
      case 'rRight':
        smoothRotateHorizontal('rRight');
        break;
      case 'zoomIn':
        zoom('zoomIn');
        break;
      case 'zoomOut':
        zoom('zoomOut');
        break;
    }
  }

  function onPress() {
    startHold(() => controlMovement(control));
  }

  return (
    <button
      className={buttonStyle}
      onMouseDown={onPress}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={onPress}
      onTouchEnd={stopHold}
    >
      {generateIcons(control)}
    </button>
  );
}
