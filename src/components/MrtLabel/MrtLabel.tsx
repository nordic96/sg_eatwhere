import { cn } from '@/utils';
import { FaSubway } from 'react-icons/fa';
import { parseMrtCodes } from './parseMrtCodes';

export default function MrtLabel({ mrtCode }: { mrtCode: string }) {
  const codes = mrtCode.split('/');
  if (codes.length <= 0) {
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
      {parseMrtCodes(mrtCode)}
    </span>
  );
}
