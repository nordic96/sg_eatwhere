import { cn } from '@/app/utils';
import { X } from 'lucide-react';
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
      <X size={20} />
    </button>
  );
}
