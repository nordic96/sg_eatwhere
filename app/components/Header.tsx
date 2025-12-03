'use client';

import React from 'react';
import Image from 'next/image';
import horizontalImage from '@/public/images/header_icon.svg';
import Link from 'next/link';
import LocaleSwitcher from './LocaleSwitcher/LocaleSwitcher';

const Header = () => {
  return (
    <div>
      <header className="bg-primary text-white flex justify-center">
        <div className="flex max-w-[1440px] items-center justify-between grow px-8 py-1">
          <div className="flex gap-1 items-center">
            <div className="">
              <Link href={'/'}>
                <Image src={horizontalImage} alt="logo" height={50} draggable={false} />
              </Link>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>
    </div>
  );
};

export default Header;
