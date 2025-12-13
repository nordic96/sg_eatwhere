import { primaryButtonStyle } from '@/app/constants';
import { cn } from '@/app/utils';
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
