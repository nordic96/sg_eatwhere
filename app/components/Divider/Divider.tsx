import React from 'react';
import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';

interface DividerProps {
  className?: string | ClassValue;
}

const Divider = (props: DividerProps) => {
  const { className } = props;
  return <hr className={cn('my-1 lg:w-full max-sm:w-full', className)} />;
};

export default Divider;
