import { Skeleton } from '@mui/material';
import React from 'react';

function SearchSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={'flex flex-col gap-2'}>
      {Array.from({ length: rows }).map((_, i) => {
        return (
          <div key={`search-skeleton-${i}`} className={'flex items-center justify-start gap-4'}>
            <Skeleton variant="circular" width={24} height={24} />
            <div className={'flex grow flex-col'}>
              <Skeleton width={'100%'} height={32} />
              <div className={'flex gap-2 w-[50%]'}>
                <Skeleton width={'100%'} />
                <Skeleton width={'100%'} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(SearchSkeleton);
