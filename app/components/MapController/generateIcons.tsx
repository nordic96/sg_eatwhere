import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ControlType } from './types';

export default function generateIcon(control: ControlType) {
  switch (control) {
    case 'left':
      return <ArrowLeft size={24} />;
    case 'right':
      return <ArrowRight size={24} />;
    case 'up':
      return <ChevronUp size={24} />;
    case 'down':
      return <ChevronDown size={24} />;
    case 'rUp':
      return <RotateCcw size={24} />;
    case 'rDown':
      return <RotateCw size={24} />;
    case 'rLeft':
      return <RotateCcw size={24} />;
    case 'rRight':
      return <RotateCw size={24} />;
    case 'zoomIn':
      return <ZoomIn size={24} />;
    case 'zoomOut':
      return <ZoomOut size={24} />;
  }
}
