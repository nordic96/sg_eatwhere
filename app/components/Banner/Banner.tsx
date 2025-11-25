"use client";
import React, { useState } from "react";

interface BannerProps {
  msg: string;
}

function Banner({ msg }: BannerProps) {
  const [closed, setClosed] = useState<boolean>(false);

  if (closed) {
    return null;
  }
  return (
    <div className="py-2 bg-orange-600 justify-center flex text-white text-md">
      <div className="flex px-16 justify-between w-[1250px]">
        <p>{msg}</p>
        <button onClick={() => setClosed(true)} className={"cursor-pointer hover:font-bold"}>
          X
        </button>
      </div>
    </div>
  );
}

export default Banner;
