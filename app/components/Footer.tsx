'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const FooterLocaleSwitcher = dynamic(() => import('./LocaleSwitcher/FooterLocaleSwitcher'));

const Footer = () => {
  const year = new Date().getFullYear();

  const t = useTranslations('Footer');

  return (
    <>
      <footer className={'flex grow pt-8 justify-center max-h-[200px]'}>
        <div className="flex flex-col grow max-w-[1440px] px-8 justify-between">
          <div className="gap-8 flex">
            <Image
              className={'w-[150]'}
              src={'/images/logo.svg'}
              alt={'logo'}
              draggable="false"
              width={'0'}
              height={'0'}
            />
            <div className="box-border grid grid-cols-3 w-[500px] gap-8">
              <div className="">
                <p className="font-bold">View Restaurant List</p>
                <div className="">
                  <p>Foodie Trail</p>
                  <p>Dessert Trail</p>
                  <p>Heritage Trail</p>
                </div>
              </div>
              <div className="">
                <p className="font-bold">View Restaurant List</p>
                <div className="">
                  <p>Foodie Trail</p>
                  <p>Dessert Trail</p>
                  <p>Heritage Trail</p>
                  <p>Heritage Trail</p>
                  <p>Heritage Trail</p>
                </div>
              </div>
              <div className="">
                <p className="font-bold">{t('changelanguage')}</p>
                <FooterLocaleSwitcher />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="flex mt-8 py-2 bg-[#333] text-white justify-center">
        <div className="flex flex-col grow max-w-[1440px] px-8">
          <p>{`© ${year} Stephen Ko All Rights Reserved`}</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
