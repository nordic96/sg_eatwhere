import { cn } from '@/app/utils';
import { AutoAwesome } from '@mui/icons-material';
import React from 'react';

function AISparkle({ isReady, isActive }: { isReady: boolean; isActive: boolean }) {
  return (
    <div
      className={cn(
        'text-monsoongrey absolute left-2 top-[50%] -translate-y-[50%] text-sm z-51',
        'transition-transform ease-in-out',
        {
          'text-monsoongrey': !isActive,
          'text-primary': isActive,
          'translate-x-0': isReady,
          '-translate-x-100': !isReady,
        },
      )}
      title={'AI-powered semantic search'}
      aria-hidden={'true'}
    >
      <AutoAwesome fontSize={'inherit'} />
    </div>
  );
}

export default React.memo(AISparkle);
