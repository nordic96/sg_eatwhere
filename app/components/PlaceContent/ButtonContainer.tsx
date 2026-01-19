'use client';
import { useHeritageStore, useTrailStore } from '@/app/stores';
import { Redo, Undo } from 'lucide-react';
import CloseButton from '../CloseButton/CloseButton';
import { cn } from '@/app/utils';
import { useCallback } from 'react';

export default function ButtonContainer() {
  const { unSelect, getThemeStyle } = useHeritageStore();
  const trailMode = useTrailStore((state) => state.trailMode);
  const moveToNextTrail = useTrailStore((state) => state.moveToNextTrail);
  const trailButtonStyle =
    'h-6 w-6 bg-primary text-white hover:bg-red-700 rounded-full cursor-pointer flex items-center justify-center';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      /** Don't handle if user is typing in an input */
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape') unSelect();
    },
    [unSelect],
  );

  return (
    <div
      className={'flex w-full justify-between items-center'}
      role="group"
      aria-label="Action buttons"
    >
      <div className={'flex gap-2'} role="group" aria-label="Trail navigation">
        {trailMode && (
          <>
            <button
              className={cn(trailButtonStyle)}
              onClick={() => moveToNextTrail(true)}
              aria-label="Previous location in trail"
            >
              <Undo size={14} />
            </button>
            <button
              className={cn(trailButtonStyle)}
              onClick={() => moveToNextTrail()}
              aria-label="Next location in trail"
            >
              <Redo size={14} />
            </button>
          </>
        )}
      </div>
      <CloseButton onClick={unSelect} customClass={getThemeStyle()} onKeyDown={handleKeyDown} />
    </div>
  );
}
