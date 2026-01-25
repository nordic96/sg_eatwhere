/* eslint-disable @next/next/no-img-element */
'use client';

import { cn } from '@/app/utils';
import { ClassValue } from 'clsx';
import { useCallback, useState, useEffect, memo, useRef, useMemo, useTransition } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TbLoader2 } from 'react-icons/tb';

interface ImageCarouselProps {
  img: string[];
  customClass?: string | ClassValue;
}

function ImageCarousel({ img, customClass }: ImageCarouselProps) {
  const [currImg, setCurrImg] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [displayImages, setDisplayImages] = useState<string[]>(img);

  const isLoading = useMemo(
    () => isPending || loadedImages.size < displayImages.length,
    [isPending, loadedImages.size, displayImages.length],
  );

  useEffect(() => {
    // Reset index immediately when images change (outside transition)
    setCurrImg(0);

    startTransition(() => {
      setLoadedImages(new Set());
      setDisplayImages(img);
    });
  }, [img]);

  const onClickLeft = useCallback(() => {
    setCurrImg((index) => (index - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  const onClickRight = useCallback(() => {
    setCurrImg((index) => (index + 1) % displayImages.length);
  }, [displayImages.length]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    function handleKeyNavigate(e: KeyboardEvent) {
      /** Don't handle if user is typing input (searchbar component) */
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onClickLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onClickRight();
      }
    }
    window.addEventListener('keydown', handleKeyNavigate);

    return () => window.removeEventListener('keydown', handleKeyNavigate);
  }, [onClickLeft, onClickRight]);

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  // Use displayImages.length for consistency between indicator and carousel
  const offset = useMemo(() => 100 / displayImages.length, [displayImages.length]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(${-currImg * offset}%)`;
    }
  }, [currImg, offset]);

  const containerBaseStyle = 'w-full h-full relative overflow-x-hidden bg-white';
  const navBtnBaseStyle =
    'absolute top-[50%] opacity-80 text-white rounded-full cursor-pointer text-3xl max-sm:text-4xl flex';
  const currImgIndicatorBaseStyle =
    'absolute px-1 bottom-1 left-[50%] -translate-x-[50%] opacity-80 rounded-xl text-white';

  return (
    <div className={cn(containerBaseStyle)} role="region" aria-label="Image carousel">
      <div
        ref={wrapperRef}
        style={{
          width: `${displayImages.length * 100}%`,
        }}
        className={cn(
          'h-full transition-transform ease-in-out',
          isLoading ? 'invisible' : 'visible flex',
        )}
        aria-live="polite"
      >
        {displayImages.map((src, i) => {
          return (
            <img
              key={`${src}-${i}`}
              style={{ width: `${100 / displayImages.length}%` }}
              className={'h-full object-cover'}
              src={src}
              alt={`Image ${i + 1} of ${displayImages.length}`}
              onLoad={() => handleImageLoad(src)}
              draggable="false"
            />
          );
        })}
      </div>
      {isLoading && <LoadingIndicator />}
      <button
        className={cn(navBtnBaseStyle, { 'left-4': true }, customClass)}
        onClick={onClickLeft}
        aria-label="Previous image"
      >
        <FaChevronLeft className="w-[1em] h-[1em]" />
      </button>
      <button
        className={cn(navBtnBaseStyle, { 'right-4': true }, customClass)}
        onClick={onClickRight}
        aria-label="Next image"
      >
        <FaChevronRight className="w-[1em] h-[1em]" />
      </button>
      <div
        className={cn(currImgIndicatorBaseStyle, customClass)}
        aria-live="polite"
        aria-atomic="true"
      >{`${currImg + 1} / ${displayImages.length}`}</div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className={'w-full h-full flex justify-center items-center text-primary'}>
      <TbLoader2 size={40} className="animate-spin" />
    </div>
  );
}

export default memo(ImageCarousel);
