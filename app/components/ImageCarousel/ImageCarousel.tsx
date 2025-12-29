/* eslint-disable @next/next/no-img-element */
'use client';

import { cn } from '@/app/utils';
import { East, West } from '@mui/icons-material';
import { ClassValue } from 'clsx';
import { useCallback, useState, useEffect, memo, useRef, useMemo } from 'react';

interface ImageCarouselProps {
  img: string[];
  customClass?: string | ClassValue;
}

function ImageCarousel({ img, customClass }: ImageCarouselProps) {
  const [currImg, setCurrImg] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => setCurrImg(0);
  }, [img]);

  const offset = useMemo(() => 100 / img.length, [img.length]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(${-currImg * offset}%)`;
    }
  }, [currImg, offset]);

  const onClickLeft = useCallback(() => {
    setCurrImg((index) => (index - 1 + img.length) % img.length);
  }, [img.length]);

  const onClickRight = useCallback(() => {
    setCurrImg((index) => (index + 1) % img.length);
  }, [img.length]);

  const containerBaseStyle = 'w-full h-full relative overflow-x-hidden bg-monsoongrey';
  const navBtnBaseStyle =
    'absolute top-[50%] opacity-80 text-white rounded-full cursor-pointer text-3xl max-sm:text-4xl flex';
  const currImgIndicatorBaseStyle =
    'absolute px-1 bottom-1 left-[50%] -translate-x-[50%] opacity-80 rounded-xl text-white';

  return (
    <div className={cn(containerBaseStyle)} role="region" aria-label="Image carousel">
      <div
        ref={wrapperRef}
        style={{ width: `${img.length * 100}%` }}
        className="flex h-full transition-transform ease-in-out"
        aria-live="polite"
      >
        {img.map((src, i) => {
          return (
            <img
              key={i}
              style={{ width: `${100 / img.length}%` }}
              className={'h-full object-cover'}
              src={src}
              alt={`Image ${i + 1} of ${img.length}`}
              draggable="false"
            />
          );
        })}
      </div>
      <button
        className={cn(navBtnBaseStyle, { 'left-4': true }, customClass)}
        onClick={onClickLeft}
        aria-label="Previous image"
      >
        <West fontSize={'inherit'} />
      </button>
      <button
        className={cn(navBtnBaseStyle, { 'right-4': true }, customClass)}
        onClick={onClickRight}
        aria-label="Next image"
      >
        <East fontSize={'inherit'} />
      </button>
      <div
        className={cn(currImgIndicatorBaseStyle, customClass)}
        aria-live="polite"
        aria-atomic="true"
      >{`${currImg + 1} / ${img.length}`}</div>
    </div>
  );
}

export default memo(ImageCarousel);
