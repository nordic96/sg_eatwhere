/* eslint-disable @next/next/no-img-element */
'use client';

import { cn } from '@/app/utils';
import { East, West } from '@mui/icons-material';
import { ClassValue } from 'clsx';
import { useCallback, useState, useEffect, memo } from 'react';

interface ImageCarouselProps {
  img: string[];
  customClass?: string | ClassValue;
}

function ImageCarousel({ img, customClass }: ImageCarouselProps) {
  const [currImg, setCurrImg] = useState<number>(0);

  useEffect(() => {
    return () => setCurrImg(0);
  }, [img]);

  useEffect(() => {
    function updatePosition() {
      const el = document.getElementById('carousel-wrapper');
      const offset = 100 / img.length;
      if (el) {
        el.style.transform = `translateX(${-currImg * offset}%)`;
      }
    }
    updatePosition();
  }, [currImg, img]);

  const onClickLeft = useCallback(() => {
    setCurrImg((index) => (index - 1 + img.length) % img.length);
  }, [img]);

  const onClickRight = useCallback(() => {
    setCurrImg((index) => (index + 1) % img.length);
  }, [img]);

  const containerBaseStyle = 'w-full h-full relative overflow-x-hidden bg-monsoongrey';
  const navBtnBaseStyle =
    'absolute top-[50%] opacity-80 text-white rounded-full cursor-pointer text-3xl max-sm:text-4xl flex';
  const currImgIndicatorBaseStyle = 'absolute px-1 top-0 right-0 opacity-80 rounded-xl text-white';

  return (
    <div className={cn(containerBaseStyle)}>
      <div
        id="carousel-wrapper"
        style={{ width: `${img.length * 100}%` }}
        className="flex h-full transition-transform ease-in-out"
      >
        {img.map((src, i) => {
          return (
            <img
              key={i}
              style={{ width: `${100 / img.length}%` }}
              className={'h-full object-cover'}
              src={src}
              alt={'main_photo'}
              draggable="false"
            />
          );
        })}
      </div>
      <div className={cn(navBtnBaseStyle, { 'left-0': true }, customClass)} onClick={onClickLeft}>
        <West fontSize={'inherit'} />
      </div>
      <div className={cn(navBtnBaseStyle, { 'right-0': true }, customClass)} onClick={onClickRight}>
        <East fontSize={'inherit'} />
      </div>
      <div
        className={cn(currImgIndicatorBaseStyle, customClass)}
      >{`${currImg + 1} / ${img.length}`}</div>
    </div>
  );
}

export default memo(ImageCarousel);
