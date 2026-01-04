'use client';

import React, { Activity } from 'react';
import Image from 'next/image';
import horizontalImage from '@/public/images/header_icon.svg';
import LocaleSwitcher from './LocaleSwitcher/LocaleSwitcher';
import { cn } from '../utils';
import { baseLayoutStyle } from '../constants/theme';
import AppLink from './AppLink';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import SearchBar from './SearchBar/SearchBar';
import { useBreakpoints } from '../hooks';

const Header = () => {
  const pathname = usePathname();
  const breakpoint = useBreakpoints();
  const t = useTranslations('Header');
  return (
    <header className="relative bg-primary text-white flex justify-center" role="banner">
      <div className={cn('flex items-center justify-between grow py-1', baseLayoutStyle)}>
        <nav className="flex gap-8 items-center" aria-label="Main navigation">
          <AppLink route={'/'}>
            <Image src={horizontalImage} alt="logo" height={50} draggable={false} />
          </AppLink>
          <AppLink route={'/mapview'}>{t(`link_mapview`)}</AppLink>
          <AppLink route={'/about'}>{t(`link_about`)}</AppLink>
        </nav>
        <LocaleSwitcher />
      </div>
      <Activity mode={pathname === '/mapview' && breakpoint === 'desktop' ? 'visible' : 'hidden'}>
        {/** Search Bar */}
        <div
          className={
            'absolute top-[50%] -translate-x-[50%] left-[50%] -translate-y-[50%] h-10 py-0.5 flex items-center z-999'
          }
        >
          <SearchBar />
        </div>
      </Activity>
    </header>
  );
};

export default Header;
