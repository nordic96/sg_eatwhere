'use client';
import { useHeritageStore, useTrailStore } from '@/app/stores';
import { Redo, Undo } from '@mui/icons-material';
import { Activity } from 'react';
import CloseButton from '../CloseButton/CloseButton';
import { cn } from '@/app/utils';

export default function ButtonContainer() {
  const { unSelect, getThemeStyle } = useHeritageStore();
  const trailMode = useTrailStore((state) => state.trailMode);
  const moveToNextTrail = useTrailStore((state) => state.moveToNextTrail);
  const trailButtonStyle =
    'h-6 w-6 bg-primary text-white hover:bg-red-700 rounded-full cursor-pointer flex items-center justify-center';
  return (
    <div className={'flex w-full justify-between items-center'} role="group" aria-label="Action buttons">
      <div className={'flex gap-2'} role="group" aria-label="Trail navigation">
        <Activity mode={trailMode ? 'visible' : 'hidden'}>
          <button
            className={cn(trailButtonStyle)}
            onClick={() => moveToNextTrail(true)}
            aria-label="Previous location in trail"
          >
            <Undo fontSize={'inherit'} />
          </button>
          <button
            className={cn(trailButtonStyle)}
            onClick={() => moveToNextTrail()}
            aria-label="Next location in trail"
          >
            <Redo fontSize={'inherit'} />
          </button>
        </Activity>
      </div>
      <CloseButton onClick={unSelect} customClass={getThemeStyle()} />
    </div>
  );
}
