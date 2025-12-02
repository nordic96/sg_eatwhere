/* eslint-disable @next/next/no-img-element */
"use client";

import { useHeritageStore } from "@/app/stores";
import { CAT_ASSET_MAP, data as foodData } from "@/app/constants/data";
import { MapOutlined, SubwayOutlined, ThumbUpOutlined } from "@mui/icons-material";

import React, { useMemo } from "react";
import HighlightedText from "../HighlightText/HighlightText";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import { cn } from "@/app/utils";
import VerticalDivider from "../VerticalDivider/VerticalDivider";

export default function PlaceContent() {
  const { openMore, getThemeStyle } = useHeritageStore();
  const heritageId = useHeritageStore((state) => state.heritageId);

  const data = useMemo(() => {
    return foodData.find((item) => item.id === heritageId) || null;
  }, [heritageId]);

  if (!heritageId || !data) {
    return <div>No data selected</div>;
  }

  const learnMoreBtnBaseStyle =
    "bg-primary py-0.5 px-4 rounded-lg text-white cursor-pointer text-md font-bold";
  return (
    <div className="w-full flex flex-col gap-2">
      {/** Carousel Container */}
      <div className={"relative w-full h-[280px]"}>
        <ImageCarousel img={data.imgSource} customClass={getThemeStyle()} />
        <span className="absolute bottom-0 left-[50%] translate-x-[-50%] text-center text-white">
          <p className="text-4xl w-[300px] font-bold">{data.name}</p>
          <p>{data.location.address}</p>
        </span>
      </div>
      {/** Info Container */}
      <div className={"flex grow justify-start items-center gap-1 text-md"}>
        <span className="flex gap-1 items-center">
          <img className="h-6" src={CAT_ASSET_MAP[data.category]} alt={"icon"} />
          <p>{data.category}</p>
        </span>
        <VerticalDivider />
        <MrtLabel mrt={data.location.mrt[0]} />
        <VerticalDivider />
        <a href={data.location.gmapUrl} target="_blank">
          <MapOutlined fontSize={"small"} />
        </a>
        <VerticalDivider />
        <p>{"$$ 10 - 20 pax"}</p>
      </div>
      {/** Desc Container */}
      <div className="flex flex-col mt-2 justify-center items-center gap-4">
        <span className="flex justify-center items-center gap-1">
          <ThumbUpOutlined />
          <div>
            {data.bestDish.map((dish, i) => (
              <HighlightedText key={i}>{dish}</HighlightedText>
            ))}
          </div>
        </span>
        <p className="font-light text-xs">
          {data.desc.substring(0, Math.min(data.desc.length, 100))}
          {data.desc.length > 100 ? "..." : ""}
        </p>
      </div>
      {/** Learn More Btn Container */}
      <div className="flex justify-center">
        <button className={cn(learnMoreBtnBaseStyle, getThemeStyle())} onClick={openMore}>
          Learn More
        </button>
      </div>
    </div>
  );
}

export function MrtLabel({ mrt }: { mrt: string }) {
  return (
    <span className="flex gap-1 items-center">
      <SubwayOutlined fontSize="small" />
      <p className="font-public-sans font-medium">{mrt}</p>
    </span>
  );
}
