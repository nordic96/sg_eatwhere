import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import { JSX, PropsWithChildren, useId } from 'react';

export interface TooltipProps {
  direction: 'left' | 'right' | 'middle';
  content?: string | JSX.Element;
  className?: string | ClassValue;
}

export default function Tooltip({
  children,
  direction,
  content,
  className,
}: PropsWithChildren<TooltipProps>) {
  const id = useId();
  return (
    <div className={'relative group'} aria-describedby={id}>
      {children}
      <div
        id={id}
        role={'tooltip'}
        className={cn(
          'absolute top-8 w-[200px] transition-opacity ease-in duration-200 opacity-0 hidden group-hover:block group-hover:opacity-100 max-sm:group-active:opacity-100 z-999',
          {
            'left-0': direction === 'left',
            '-right-[60px]': direction === 'middle',
            'right-0': direction === 'right',
          },
          className,
        )}
      >
        <div className={'bg-[#333] text-white rounded py-1 px-2 relative whitespace-pre-line'}>
          {content}
          <div
            className={cn(
              'absolute transform -translate-x-1/2 -top-3.5 h-0 w-0 rotate-180 border-8 border-transparent border-t-[#333]',
              {
                'left-2': direction === 'left',
                'right-[40%]': direction === 'middle',
                'right-2': direction === 'right',
              },
            )}
          ></div>
        </div>
      </div>
    </div>
  );
}
