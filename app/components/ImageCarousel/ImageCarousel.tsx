/* eslint-disable @next/next/no-img-element */
"use client";

import { East, West } from "@mui/icons-material";
import { useCallback, useState } from "react";

interface ImageCarouselProps {
  img: string[];
}

export default function ImageCarousel({ img }: ImageCarouselProps) {
  const [currImg, setCurrImg] = useState<number>(0);

  const onClickLeft = useCallback(() => {
    setCurrImg((index) => (index - 1 + img.length) % img.length);
  }, [img]);

  const onClickRight = useCallback(() => {
    setCurrImg((index) => (index + 1) % img.length);
  }, [img]);

  return (
    <div className="relative w-full h-full bg-monsoongrey">
      <img className="w-full h-full object-cover" src={img[currImg]} alt={"main_photo"} />
      <div
        className="absolute left-0 top-[50%] opacity-80 text-white bg-primary rounded-3xl cursor-pointer"
        onClick={onClickLeft}
      >
        <West fontSize={"large"} />
      </div>
      <div
        className="absolute right-0 top-[50%] opacity-80 text-white bg-primary rounded-3xl cursor-pointer"
        onClick={onClickRight}
      >
        <East fontSize={"large"} />
      </div>
      <div className="absolute px-1 top-0 right-0 opacity-80 rounded-xl bg-primary text-white">{`${currImg + 1} / ${img.length}`}</div>
    </div>
  );
}
