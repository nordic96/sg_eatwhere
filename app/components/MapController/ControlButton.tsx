import generateIcons from './generateIcons';
import { ControlType } from './types';
import { MapControllerProps } from './MapController';
import useCameraControls from '@/app/hooks/useCameraControls';

type ControlButtonProps = MapControllerProps & {
  control: ControlType;
};

export const buttonStyle =
  'w-7 h-7 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 text-white bg-primary hover:bg-red-600 active:bg-red-600 rounded-lg flex justify-center items-center cursor-pointer touch-manipulation';

export default function ControlButton({ control, camera, controls }: ControlButtonProps) {
  const cameraControls = useCameraControls(controls.current, camera.current);

  const actionMap: Record<ControlType, () => void> = {
    up: cameraControls.panUp,
    down: cameraControls.panDown,
    left: cameraControls.panLeft,
    right: cameraControls.panRight,

    rLeft: cameraControls.rotateLeft,
    rRight: cameraControls.rotateRight,
    rUp: cameraControls.rotateUp,
    rDown: cameraControls.rotateDown,

    zoomIn: cameraControls.zoomIn,
    zoomOut: cameraControls.zoomOut,
  };

  const ariaLabelMap: Record<ControlType, string> = {
    up: 'Pan up',
    down: 'Pan down',
    left: 'Pan left',
    right: 'Pan right',
    rLeft: 'Rotate left',
    rRight: 'Rotate right',
    rUp: 'Rotate up',
    rDown: 'Rotate down',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  };

  function onPress() {
    cameraControls.startHold(() => actionMap[control]());
  }

  return (
    <button
      className={buttonStyle}
      onMouseDown={onPress}
      onMouseUp={cameraControls.stopHold}
      onMouseLeave={cameraControls.stopHold}
      onTouchStart={onPress}
      onTouchEnd={cameraControls.stopHold}
      aria-label={ariaLabelMap[control]}
    >
      {generateIcons(control)}
    </button>
  );
}
