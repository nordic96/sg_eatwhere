import React from "react";
import Link from "next/link";
import Image from "next/image";
import LabelContainer from "labelcontainer";
import horizontalImage from "@/public/images/foodies_trail_sg_logo_horitontal.svg";

const Header = () => {
  const lsInstance = LabelContainer.getInstance();
  return (
    <div>
      <header>
        <div className="flex items-center justify-between grow px-8 py-2 shadow-lg">
          <div className="flex gap-4 items-center">
            <div className="">
              <Image src={horizontalImage} alt="logo" width={80} />
            </div>
            <Link href={"/"}>
              <p className="font-semibold text-md">{lsInstance.getLabel("header_title")}</p>
            </Link>
          </div>
          <div>
            <Link href={"/about"}>About</Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
