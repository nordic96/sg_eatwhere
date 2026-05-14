import { cn } from '@/utils';
import React from 'react';
import { TbLoader2 } from 'react-icons/tb';

function LoadingProgress({ isReady }: { isReady: boolean }) {
  return (
    <div
      className={cn(
        'text-primary absolute left-2 top-[50%] -translate-y-[40%] text-sm z-51',
        'transition-transform ease-in-out',
        {
          'translate-x-0': !isReady,
          '-translate-x-100': isReady,
        },
      )}
    >
      <TbLoader2 size={16} className="animate-spin" strokeWidth={3} />
    </div>
  );
}

export default React.memo(LoadingProgress);
