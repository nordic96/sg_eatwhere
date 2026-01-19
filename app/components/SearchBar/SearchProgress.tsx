import { cn } from '@/app/utils';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { TbLoader2 } from 'react-icons/tb';

function SearchProgress({ isSearching }: { isSearching: boolean }) {
  return (
    <div
      className={cn('text-primary absolute right-2 top-[50%] text-xl', {
        '-translate-y-[40%]': isSearching,
        '-translate-y-[50%]': !isSearching,
      })}
    >
      {isSearching && (
        <TbLoader2
          size={16}
          className="animate-spin"
          strokeWidth={3}
          aria-label={'Searching for results'}
        />
      )}
      {!isSearching && <FaSearch className="w-[1em] h-[1em]" />}
    </div>
  );
}

export default React.memo(SearchProgress);
