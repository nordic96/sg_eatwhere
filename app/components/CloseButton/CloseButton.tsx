import { cn } from '@/app/utils';
import Close from '@mui/icons-material/Close';
import { ClassValue } from 'clsx';
import React from 'react';

interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  customClass?: string | ClassValue;
}
export default function CloseButton(props: CloseButtonProps) {
  return (
    <button
      className={cn('w-6 h-6 cursor-pointer rounded-xl text-center text-white', props.customClass)}
      onClick={props.onClick}
      aria-label="Close"
    >
      <Close />
    </button>
  );
}
