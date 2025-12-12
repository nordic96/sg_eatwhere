'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { cn } from '../utils';
import { baseLayoutStyle } from '../constants/theme';
import AppLink from './AppLink';
import NameCard from './NameCard/NameCard';
const FooterLocaleSwitcher = dynamic(() => import('./LocaleSwitcher/FooterLocaleSwitcher'));

const Footer = () => {
  const year = new Date().getFullYear();
  const headerT = useTranslations('Header');
  const t = useTranslations('Footer');

  return (
    <>
      <footer className={'flex grow pt-8 max-sm:pt-4 justify-center max-h-[200px]'}>
        <div className={cn('flex flex-col justify-between grow', baseLayoutStyle)}>
          <div className="flex gap-8 max-sm:gap-4">
            <Image
              className={'w-[150px] max-sm:w-20'}
              src={'/images/logo.svg'}
              alt={'logo'}
              draggable="false"
              width={'0'}
              height={'0'}
            />
            <div className="box-border grid grid-cols-2 w-[300px] max-sm:w-full gap-8 max-sm:gap-2">
              <div className="">
                <p className="font-bold">{t('column_website')}</p>
                <div className="flex flex-col">
                  <AppLink route={'/'}>{headerT('link_landing')}</AppLink>
                  <AppLink route={'/mapview'}>{headerT('link_mapview')}</AppLink>
                  <AppLink route={'/about'}>{headerT('link_about')}</AppLink>
                  <NameCard />
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
        <div className={cn('flex flex-col grow', baseLayoutStyle)}>
          <p>{`© ${year} Developed by Stephen Gihun Ko`}</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
