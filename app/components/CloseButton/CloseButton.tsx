import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import React, { useEffect } from 'react';
import { FaX } from 'react-icons/fa6';

interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  customClass?: string | ClassValue;
  onKeyDown?: (e: KeyboardEvent) => void;
}
export default function CloseButton({ customClass, onClick, onKeyDown }: CloseButtonProps) {
  useEffect(() => {
    if (onKeyDown) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (onKeyDown) {
        window.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [onKeyDown]);

  return (
    <button
      className={cn('w-6 h-6 cursor-pointer rounded-xl text-center text-white', customClass)}
      onClick={onClick}
      aria-label="Close"
    >
      <FaX size={20} />
    </button>
  );
}
