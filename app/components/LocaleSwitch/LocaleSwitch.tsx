'use client';

import { LocaleIconMap } from '@/app/constants/localeIconMap';
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
      className="flex gap-4 items-center justify-between text-lg cursor-pointer"
    >
      <span className={LocaleIconMap[locale]}></span>
      <label className="text-xs hover:text-primary cursor-pointer">{langNames.of(locale)}</label>
    </div>
  );
}
