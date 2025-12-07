import { PropsWithChildren } from 'react';
import { AppRoute } from '../routes';
import Link from 'next/link';

type AppLinkProps = {
  route: AppRoute;
};
export default function AppLink({ route, children }: AppLinkProps & PropsWithChildren) {
  return <Link href={route}>{children}</Link>;
}
