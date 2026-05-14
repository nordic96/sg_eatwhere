import { ClassValue } from 'clsx';

export const mrtColourStyle = (code: string): ClassValue => ({
  'bg-blue-600': code === 'DT',
  'bg-green-600': code === 'EW',
  'bg-purple-600': code === 'NE',
  'bg-goldenmile': code === 'CC',
  'bg-yellow-800': code === 'TE',
});
