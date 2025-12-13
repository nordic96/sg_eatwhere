'use client';

import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import React, { Activity, useId, useState } from 'react';

type ToggleButtonProps = {
  label?: string | React.JSX.Element;
  className?: string | ClassValue;
  onToggle?: () => void;
};
export default function ToggleButton({ label, className, onToggle }: ToggleButtonProps) {
  const toggleId = useId();
  const [toggle, setToggle] = useState(false);

  function handleToggle() {
    if (onToggle) onToggle();
    setToggle((t) => !t);
  }

  return (
    <div className={cn('flex gap-1 items-center', className)}>
      <div
        id={toggleId}
        role={'button'}
        aria-pressed={toggle}
        className={cn(
          'w-11 p-0.5 rounded-full cursor-pointer border border-[#333] shadow-lg',
          toggle ? 'bg-gray-100' : 'bg-gray-200',
        )}
        onClick={handleToggle}
      >
        <div
          className={cn(
            'w-5 h-5 rounded-full  hover:bg-red-700 shadow-2xl transition-transform ease-in-out border border-[#333]',
            toggle ? 'bg-red-700 translate-x-full' : 'bg-primary translate-x-0',
          )}
        ></div>
      </div>
      <Activity mode={label !== undefined ? 'visible' : 'hidden'}>
        <label aria-labelledby={toggleId}>{label}</label>
      </Activity>
    </div>
  );
}
