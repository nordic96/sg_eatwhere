'use client';

import React from 'react';
import Image from 'next/image';
import horizontalImage from '@/public/images/header_icon.svg';
import LocaleSwitcher from './LocaleSwitcher/LocaleSwitcher';
import { cn } from '../utils';
import { baseLayoutStyle } from '../constants/theme';
import AppLink from './AppLink';

const Header = () => {
  return (
    <div>
      <header className="bg-primary text-white flex justify-center">
        <div className={cn('flex items-center justify-between grow py-1', baseLayoutStyle)}>
          <div className="flex gap-8 items-center">
            <div className="">
              <AppLink route={'/'}>
                <Image src={horizontalImage} alt="logo" height={50} draggable={false} />
              </AppLink>
            </div>
            <div className="">
              <AppLink route={'/mapview'}>{'MapView'}</AppLink>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>
    </div>
  );
};

export default Header;
