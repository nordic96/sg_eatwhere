import { useRef } from 'react';

import { useLocale } from 'next-intl';
import useLangNames from '@/i18n/useLangNames';

import { useAppStore } from '@/app/stores';

import Translate from '@mui/icons-material/Translate';
import LocaleSwitch from '../LocaleSwitch/LocaleSwitch';
import useClickOutside from '@/app/hooks/useClickOutside';
import { LocaleIconMap } from '@/app/constants/localeIconMap';
import { AvailableLocales } from '@/i18n/locales';

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const ref = useRef(null);
  const { localeOpen, openLocale, closeLocale } = useAppStore();
  const localeNames = useLangNames(currentLocale);
  useClickOutside(ref, closeLocale);

  return (
    <div className="relative w-[130px]">
      <div className="flex grow justify-between items-center">
        <Translate fontSize="small" />
        <div className="text-sm items-center flex justify-end gap-1">
          <span className={LocaleIconMap[currentLocale]}></span>
          <label onClick={openLocale} className="text-xs cursor-pointer pr-2">
            {localeNames.of(currentLocale)}
          </label>
        </div>
      </div>
      {localeOpen && (
        <div
          ref={ref}
          id="locale-swticher"
          className="absolute shadow-xl border-[#333] border top-[38px] right-0 z-999 bg-[#f3f3f3] text-black rounded-b-lg w-[146px] flex flex-col p-2 gap-1"
        >
          {AvailableLocales.map((locale, id) => (
            <LocaleSwitch key={id} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
