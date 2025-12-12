import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Rotate90DegreesCcw from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCw from '@mui/icons-material/Rotate90DegreesCw';
import RotateLeft from '@mui/icons-material/RotateLeft';
import RotateRight from '@mui/icons-material/RotateRight';
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import { ControlType } from './types';

export default function generateIcon(control: ControlType) {
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
