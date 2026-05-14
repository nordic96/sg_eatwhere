'use client';

import { AvailableLocales } from '@/i18n/locales';
import { usePathname, useRouter } from '@/i18n/navigation';
import useLangNames from '@/i18n/useLangNames';
import { useLocale } from 'next-intl';

export default function FooterLocaleSwitcher() {
  const currentLocale = useLocale();
  const localeNames = useLangNames(currentLocale);

  const pathname = usePathname();
  const router = useRouter();

  const onChangeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    router.replace(pathname, { locale: e.target.value });
  };

  return (
    <select
      className="border border-[#333] py-1 w-[120px] mt-1"
      value={currentLocale}
      onChange={onChangeLocale}
    >
      {AvailableLocales.map((locale, id) => (
        <option value={locale} key={id}>
          {localeNames.of(locale)}
        </option>
      ))}
    </select>
  );
}
