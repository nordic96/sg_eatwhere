'use client';

import { LocaleIconMap } from '@/app/constants/localeIconMap';
import useLangNames from '@/i18n/useLangNames';

export default function LocaleSwitch({ locale }: { locale: string }) {
  const langNames = useLangNames(locale);
  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    cookieStore.set('locale', locale);
    location.reload();
  }
  return (
    <div
      onClick={onClick}
      className="flex gap-4 items-center justify-between text-lg cursor-pointer"
    >
      <span className={LocaleIconMap[locale]}></span>
      <label className="text-sm hover:text-primary cursor-pointer">{langNames.of(locale)}</label>
    </div>
  );
}
