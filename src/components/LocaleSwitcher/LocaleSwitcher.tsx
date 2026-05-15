import { useRef } from 'react';

import { useLocale } from 'next-intl';

import { useAppStore } from '@/stores';

import LocaleSwitch from '../LocaleSwitch/LocaleSwitch';
import useClickOutside from '@/hooks/useClickOutside';
import { LocaleIconMap } from '@/constants/localeIconMap';
import { AvailableLocales } from '@/i18n/locales';
import { MdTranslate } from 'react-icons/md';

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const ref = useRef(null);
  const { localeOpen, openLocale, closeLocale } = useAppStore();
  useClickOutside(ref, closeLocale);

  return (
    <div className="relative">
      <button
        onClick={openLocale}
        className="flex grow justify-between items-center gap-2"
        aria-expanded={localeOpen}
        aria-haspopup="menu"
        aria-label="Language selector"
      >
        <MdTranslate size={24} className="cursor-pointer hover:text-goldenmile" />
        <div className="text-sm items-center flex justify-center bg-white w-6 h-6 rounded-full overflow-hidden">
          <span className={LocaleIconMap[currentLocale]}></span>
        </div>
      </button>
      {localeOpen && (
        <div
          ref={ref}
          id="locale-swticher"
          role="menu"
          aria-label="Language options"
          className="absolute shadow-xl border-[#333] border top-[38px] right-0 z-50 bg-[#f3f3f3] text-black rounded-b-lg w-30 max-sm:w-[100px] lg:w-30 flex flex-col p-2 gap-1"
        >
          {AvailableLocales.map((locale, id) => (
            <LocaleSwitch key={id} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
