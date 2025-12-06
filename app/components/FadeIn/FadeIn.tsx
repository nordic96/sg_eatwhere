'use client';
import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';

type TextProps = {
  className?: string | ClassValue;
};

export default function FadeIn({ children, className }: PropsWithChildren & TextProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, [setLoaded]);
  const baseStyle = 'transition-opacity duration-700 ease-in';
  return (
    <div
      className={cn(baseStyle, className, {
        'opacity-100': loaded,
        'opacity-0': !loaded,
      })}
    >
      {children}
    </div>
  );
}
