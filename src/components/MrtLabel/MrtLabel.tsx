import { cn } from '@/utils';
import { FaSubway } from 'react-icons/fa';
import MRTColourLabel from './MRTColourLabel';

export default function MrtLabel({ mrtCodes }: { mrtCodes: string[] }) {
  if (mrtCodes.length <= 0) {
    return null;
  }
  return (
    <span className="flex gap-1 items-center">
      {/** MRT Icon Container */}
      <div
        className={cn(
          'w-4 h-4 z-20',
          'bg-white rounded-full flex text-base items-center justify-center',
        )}
      >
        <FaSubway fontSize={'inherit'} />
      </div>
      {/** MRT Colour Bar Container */}
      {mrtCodes.map((code, i) => {
        return <MRTColourLabel key={`mrt-label-${code}-${i}`} code={code} />;
      })}
    </span>
  );
}
