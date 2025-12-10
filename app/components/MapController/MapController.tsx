'use client';
import {
  ArrowDropDown,
  ArrowDropUp,
  ArrowLeft,
  ArrowRight,
  Expand,
  Rotate90DegreesCcw,
  Rotate90DegreesCw,
  RotateLeft,
  RotateRight,
  ThreeSixty,
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

const buttonStyle =
  'w-7 h-7 text-white bg-primary hover:bg-red-600 active:bg-red-600 rounded-lg flex justify-center items-center cursor-pointer';
export default function MapController() {
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
    if (expanded) {
      expandControls();
    }
    return () => {
      shrinkControls();
    };
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
        <ControlButton control={'zoomIn'} />
        <ControlButton control={'zoomOut'} />
        <ControlButtonGroup mode={'move'} />
        <ControlButtonGroup mode={'rotate'} />
      </div>
    </div>
  );
}

type ControlMode = 'move' | 'rotate';
type ControlType =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'rLeft'
  | 'rRight'
  | 'rUp'
  | 'rDown'
  | 'zoomIn'
  | 'zoomOut';

function ControlButtonGroup({ mode }: { mode: ControlMode }) {
  return (
    <div className={'grid grid-cols-3 grid-rows-3'}>
      <div></div>
      <ControlButton control={mode === 'move' ? 'up' : 'rUp'} />
      <div></div>
      <ControlButton control={mode === 'move' ? 'left' : 'rLeft'} />
      <div className={'flex justify-center items-center text-primary'}>
        {mode === 'move' ? <ZoomOutMap /> : <ThreeSixty />}
      </div>
      <ControlButton control={mode === 'move' ? 'right' : 'rRight'} />
      <div></div>
      <ControlButton control={mode === 'move' ? 'down' : 'rDown'} />
      <div></div>
    </div>
  );
}

type ControlButtonProps = {
  control: ControlType;
};

function ControlButton({ control }: ControlButtonProps) {
  function generateIcon() {
    switch (control) {
      case 'left':
        return <ArrowLeft />;
      case 'right':
        return <ArrowRight />;
      case 'up':
        return <ArrowDropUp />;
      case 'down':
        return <ArrowDropDown />;
      case 'rUp':
        return <Rotate90DegreesCcw />;
      case 'rDown':
        return <Rotate90DegreesCw />;
      case 'rLeft':
        return <RotateLeft />;
      case 'rRight':
        return <RotateRight />;
      case 'zoomIn':
        return <ZoomIn />;
      case 'zoomOut':
        return <ZoomOut />;
    }
  }
  return <button className={buttonStyle}>{generateIcon()}</button>;
}
