'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import horizontalImage from '@/public/images/header_icon.svg';
import { Translate } from '@mui/icons-material';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import LocaleSwitcher from './LocaleSwitcher/LocaleSwitcher';
import useLangNames from '@/i18n/useLangNames';
import { useAppStore } from '../stores';
import useClickOutside from '../hooks/useClickOutside';
import { LocaleIconMap } from '../constants/localeIconMap';

const Header = () => {
  const currentLocale = useLocale();
  const ref = useRef(null);
  const { localeOpen, openLocale, closeLocale } = useAppStore();
  const localeNames = useLangNames(currentLocale);
  useClickOutside(ref, closeLocale);

  return (
    <div>
      <header className="bg-primary text-white flex justify-center">
        <div className="flex max-w-[1440px] items-center justify-between grow px-8 py-1">
          <div className="flex gap-1 items-center">
            <div className="">
              <Link href={'/'}>
                <Image src={horizontalImage} alt="logo" height={50} />
              </Link>
            </div>
          </div>
          <div className="relative w-[100px]">
            <div className="flex gap-4 justify-between items-center">
              <Translate fontSize="small" />
              <div className="text-sm items-center flex flex-1">
                <span className={LocaleIconMap[currentLocale]}></span>
                <label onClick={openLocale} className="text-sm p-1 cursor-pointer">
                  {localeNames.of(currentLocale)}
                </label>
              </div>
            </div>
            {localeOpen && (
              <div
                ref={ref}
                id="locale-swticher"
                className="absolute shadow-xl border-[#333] border top-[38px] right-0 z-999 bg-[#f3f3f3] text-black rounded-b-lg w-[116px] flex flex-col p-2 gap-1"
              >
                <LocaleSwitcher locale={'en'} />
                <LocaleSwitcher locale={'ko'} />
                <LocaleSwitcher locale={'ja'} />
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
