import { FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ControlType } from './types';
import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';

export default function generateIcon(control: ControlType) {
  switch (control) {
    case 'left':
      return <FaArrowLeft size={24} />;
    case 'right':
      return <FaArrowRight size={24} />;
    case 'up':
      return <FaChevronUp size={24} />;
    case 'down':
      return <FaChevronDown size={24} />;
    case 'rUp':
      return <FiRotateCcw size={24} />;
    case 'rDown':
      return <FiRotateCw size={24} />;
    case 'rLeft':
      return <FiRotateCcw size={24} />;
    case 'rRight':
      return <FiRotateCw size={24} />;
    case 'zoomIn':
      return <FiZoomIn size={24} />;
    case 'zoomOut':
      return <FiZoomOut size={24} />;
  }
}
