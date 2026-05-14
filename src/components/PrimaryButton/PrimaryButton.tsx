import { primaryButtonStyle } from '@/constants';
import { cn } from '@/utils';
import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react';

export default function PrimaryButton({
  children,
  ...btnProps
}: PropsWithChildren &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  const { className, ...props } = btnProps;
  return (
    <button className={cn(primaryButtonStyle, className)} {...props}>
      {children}
    </button>
  );
}
