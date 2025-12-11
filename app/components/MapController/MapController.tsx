'use client';
import { Expand, ThreeSixty, ZoomOutMap } from '@mui/icons-material';
import { RefObject, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MapControls as MapControlsImpl } from 'three-stdlib';
import ControlButton, { buttonStyle } from './ControlButton';
import { ControlMode } from './types';

export type MapControllerProps = {
  controls: RefObject<MapControlsImpl | null>;
  camera: RefObject<THREE.Camera | null>;
};

export default function MapController({ controls, camera }: MapControllerProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded((t) => !t);
  };

  function expandControls() {
    const el = document.getElementById('controls-container');
    if (el === null) return;

    el.classList.remove('translate-y-0');
    el.classList.add('translate-y-[90%]');
  }

  function shrinkControls() {
    const el = document.getElementById('controls-container');
    if (el === null) return;

    el.classList.remove('translate-y-[90%]');
    el.classList.add('translate-y-0');
  }

  useEffect(() => {
    if (!expanded) expandControls();
    return () => shrinkControls();
  }, [expanded]);

  return (
    <div className={'flex flex-col items-center gap-2'}>
      <div
        id={'controls-container'}
        className={
          'flex flex-col gap-2 items-center transition-translate translate-y-0 duration-500 ease-in-out'
        }
      >
        <button className={buttonStyle} onClick={toggleExpand}>
          <Expand />
        </button>
        <ControlButton controls={controls} camera={camera} control={'zoomIn'} />
        <ControlButton controls={controls} camera={camera} control={'zoomOut'} />
        <ControlButtonGroup controls={controls} camera={camera} mode={'move'} />
        <ControlButtonGroup controls={controls} camera={camera} mode={'rotate'} />
      </div>
    </div>
  );
}

type ControlButtonGroupProps = MapControllerProps & {
  mode: ControlMode;
};

function ControlButtonGroup({ mode, controls, camera }: ControlButtonGroupProps) {
  return (
    <div className={'grid grid-cols-3 grid-rows-3'}>
      <div></div>
      <ControlButton controls={controls} camera={camera} control={mode === 'move' ? 'up' : 'rUp'} />
      <div></div>
      <ControlButton
        controls={controls}
        camera={camera}
        control={mode === 'move' ? 'left' : 'rLeft'}
      />
      <div className={'flex justify-center items-center text-primary'}>
        {mode === 'move' ? <ZoomOutMap /> : <ThreeSixty />}
      </div>
      <ControlButton
        controls={controls}
        camera={camera}
        control={mode === 'move' ? 'right' : 'rRight'}
      />
      <div></div>
      <ControlButton
        controls={controls}
        camera={camera}
        control={mode === 'move' ? 'down' : 'rDown'}
      />
      <div></div>
    </div>
  );
}
