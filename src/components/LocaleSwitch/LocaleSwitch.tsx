'use client';

import { LocaleIconMap } from '@/constants/localeIconMap';
import { usePathname, useRouter } from '@/i18n/navigation';
import useLangNames from '@/i18n/useLangNames';

export default function LocaleSwitch({ locale }: { locale: string }) {
  const langNames = useLangNames(locale);

  const pathname = usePathname();
  const router = useRouter();

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    router.replace(pathname, { locale: locale });
  }

  return (
    <div
      onClick={onClick}
      role="menuitem"
      aria-label={`Switch to ${langNames.of(locale)}`}
      className="flex gap-1 items-center justify-between text-lg cursor-pointer hover:text-primary"
    >
      <span className={LocaleIconMap[locale]}></span>
      <label className="text-xs wrap-break-word cursor-pointer">{langNames.of(locale)}</label>
    </div>
  );
}
