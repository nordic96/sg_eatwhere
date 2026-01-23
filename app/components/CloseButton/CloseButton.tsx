import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import React, { useEffect, useRef } from 'react';
import { FaX } from 'react-icons/fa6';

type KeyboardEventHandler = (e: KeyboardEvent) => void;
interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  customClass?: string | ClassValue;
  onKeyDown?: KeyboardEventHandler;
}
export default function CloseButton({ customClass, onClick, onKeyDown }: CloseButtonProps) {
  const handlerRef = useRef<KeyboardEventHandler | null>(null);

  useEffect(() => {
    handlerRef.current = onKeyDown ?? null;
  }, [onKeyDown]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const listener = (e: KeyboardEvent) => {
      handlerRef.current?.(e);
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

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
