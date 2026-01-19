import { cn } from '@/app/utils';
import { Search, Loader2 } from 'lucide-react';
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
        <Loader2
          size={16}
          className="animate-spin"
          strokeWidth={3}
          aria-label={'Searching for results'}
        />
      )}
      {!isSearching && <Search className="w-[1em] h-[1em]" />}
    </div>
  );
}

export default React.memo(SearchProgress);
