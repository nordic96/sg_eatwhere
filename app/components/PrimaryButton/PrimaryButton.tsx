import { cn } from '@/app/utils';
import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react';

export default function PrimaryButton({
  children,
  ...btnProps
}: PropsWithChildren &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  const { className, ...props } = btnProps;
  return (
    <button
      className={cn(
        'bg-primary text-white hover:bg-red-700 cursor-pointer py-2 px-4 rounded-2xl text-md',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
