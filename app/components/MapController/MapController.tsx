'use client';
import { Expand, ThreeSixty, ZoomOutMap } from '@mui/icons-material';
import { RefObject, useState } from 'react';
import * as THREE from 'three';
import { MapControls as MapControlsImpl } from 'three-stdlib';
import ControlButton, { buttonStyle } from './ControlButton';
import { ControlMode } from './types';
import { cn } from '@/app/utils';

export type MapControllerProps = {
  controls: RefObject<MapControlsImpl | null>;
  camera: RefObject<THREE.Camera | null>;
};

export default function MapController({ controls, camera }: MapControllerProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded((t) => !t);
  };

  return (
    <div className={'flex flex-col items-center gap-2'} role="group" aria-label="Map controls">
      <div
        className={cn(
          'flex flex-col gap-2 items-center transition-transform duration-500 ease-in-out',
          expanded ? 'translate-y-0' : 'translate-y-[90%]',
        )}
      >
        <button
          className={buttonStyle}
          onClick={toggleExpand}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse controls' : 'Expand controls'}
        >
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
    <div
      className={'grid grid-cols-3 grid-rows-3'}
      role="group"
      aria-label={mode === 'move' ? 'Pan controls' : 'Rotate controls'}
    >
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
