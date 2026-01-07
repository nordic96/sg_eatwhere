import { cn } from '@/app/utils';
import Search from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

function SearchProgress({ isSearching }: { isSearching: boolean }) {
  return (
    <div
      className={cn('text-primary absolute right-2 top-[50%] text-xl', {
        '-translate-y-[40%]': isSearching,
        '-translate-y-[50%]': !isSearching,
      })}
    >
      {isSearching && (
        <CircularProgress
          color={'inherit'}
          size={'16px'}
          thickness={8}
          aria-label={'Searching for results'}
        />
      )}
      {!isSearching && <Search fontSize={'inherit'} />}
    </div>
  );
}

export default React.memo(SearchProgress);
