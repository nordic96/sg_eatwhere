import { PropsWithChildren } from 'react';
import { AppRoute } from '../routes';
import Link from 'next/link';
import { ClassValue } from 'clsx';
import { cn } from '../utils';

type AppLinkProps = {
  route: AppRoute;
  className?: string | ClassValue | null;
};
export default function AppLink({ route, className, children }: AppLinkProps & PropsWithChildren) {
  return (
    <Link className={cn(className)} href={route}>
      {children}
    </Link>
  );
}
