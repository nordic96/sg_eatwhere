/* eslint-disable @next/next/no-img-element */
"use client";

import { East, West } from "@mui/icons-material";
import { useCallback, useState, useEffect } from "react";

interface ImageCarouselProps {
  img: string[];
}

export default function ImageCarousel({ img }: ImageCarouselProps) {
  const [currImg, setCurrImg] = useState<number>(0);

  useEffect(() => {
    function updatePosition() {
      const el = document.getElementById("carousel-wrapper");
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

  return (
    <div className="w-full h-full relative bg-monsoongrey overflow-x-hidden">
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
              className={"h-full object-cover"}
              src={src}
              alt={"main_photo"}
            />
          );
        })}
      </div>
      <div
        className="absolute left-0 top-[50%] opacity-80 text-white bg-primary rounded-3xl cursor-pointer"
        onClick={onClickLeft}
      >
        <West fontSize={"medium"} />
      </div>
      <div
        className="absolute right-0 top-[50%] opacity-80 text-white bg-primary rounded-3xl cursor-pointer"
        onClick={onClickRight}
      >
        <East fontSize={"medium"} />
      </div>
      <div className="absolute px-1 top-0 right-0 opacity-80 rounded-xl bg-primary text-white">{`${currImg + 1} / ${img.length}`}</div>
    </div>
  );
}
