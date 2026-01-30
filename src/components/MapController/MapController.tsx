'use client';
import { RefObject, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MapControls as MapControlsImpl } from 'three-stdlib';
import ControlButton, { buttonStyle } from './ControlButton';
import { ControlMode } from './types';
import { cn, geoConverter } from '@/utils';
import useCameraControls from '@/hooks/useCameraControls';
import { useHeritageStore } from '@/stores';
import { FaExpand } from 'react-icons/fa';
import { BiMove } from 'react-icons/bi';
import { FiRotateCw } from 'react-icons/fi';

export type MapControllerProps = {
  controls: RefObject<MapControlsImpl | null>;
  camera: RefObject<THREE.Camera | null>;
};

export default function MapController({ controls, camera }: MapControllerProps) {
  const [expanded, setExpanded] = useState(true);
  const heritageId = useHeritageStore((state) => state.heritageId);
  const getSelectedFoodData = useHeritageStore((state) => state.getSelectedFoodData);

  const { focusOnLocation } = useCameraControls(controls.current, camera.current);

  const selectedFoodData = getSelectedFoodData();
  useEffect(() => {
    if (selectedFoodData !== null && heritageId) {
      const vector = geoConverter(selectedFoodData.location.geoLocation);
      focusOnLocation(new THREE.Vector3(...vector));
    }
  }, [heritageId, focusOnLocation, selectedFoodData]);

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
          <FaExpand size={24} />
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
        {mode === 'move' ? <BiMove size={24} /> : <FiRotateCw size={24} />}
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
