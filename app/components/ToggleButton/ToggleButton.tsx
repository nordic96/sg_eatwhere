'use client';

import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import React, { useId } from 'react';

type ToggleButtonProps = {
  label?: string | React.JSX.Element;
  className?: string | ClassValue;
  on: boolean;
  onToggle?: () => void;
};
export default function ToggleButton({ label, className, onToggle, on }: ToggleButtonProps) {
  const toggleId = useId();
  function handleToggle() {
    if (onToggle) onToggle();
  }

  return (
    <div className={cn('flex gap-1 items-center', className)}>
      <div
        id={toggleId}
        role={'button'}
        aria-pressed={on}
        aria-label={typeof label === 'string' ? `Toggle ${label}` : 'Toggle'}
        className={cn(
          'w-11 p-0.5 rounded-full cursor-pointer border border-[#333] shadow-lg',
          on ? 'bg-gray-100' : 'bg-monsoongrey',
        )}
        onClick={handleToggle}
      >
        <div
          className={cn(
            'w-5 h-5 rounded-full  hover:bg-red-700 shadow-2xl transition-transform ease-in-out border border-[#333]',
            on ? 'bg-red-700 translate-x-full' : 'bg-primary translate-x-0',
          )}
        ></div>
      </div>
      {label !== undefined && <label aria-labelledby={toggleId}>{label}</label>}
    </div>
  );
}
