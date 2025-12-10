import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import { JSX, PropsWithChildren, useId } from 'react';

export interface TooltipProps {
  content?: string | JSX.Element;
  className?: string | ClassValue;
}

export default function Tooltip({ children, content, className }: PropsWithChildren<TooltipProps>) {
  const id = useId();
  return (
    <div className={'relative group'} aria-describedby={id}>
      {children}
      <div
        id={id}
        role={'tooltip'}
        className={cn(
          'absolute top-8 transition-opacity ease-in duration-200 opacity-0 group-hover:opacity-100 z-999',
          className,
        )}
      >
        <div
          className={
            'bg-[#333] text-white rounded py-1 px-2 relative min-w-[150px] whitespace-pre-line'
          }
        >
          {content}
          <div className="absolute left-2 transform -translate-x-1/2 -top-3.5 h-0 w-0 rotate-180 border-8 border-transparent border-t-[#333]"></div>
        </div>
      </div>
    </div>
  );
}
