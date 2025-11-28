import React from "react";
import Link from "next/link";
import Image from "next/image";
import horizontalImage from "@/public/images/foodies_trail_sg_header_icon.svg";

const Header = () => {
  return (
    <div>
      <header>
        <div className="flex items-center justify-between grow px-8 py-2 shadow-lg hover:text-primary">
          <div className="flex gap-1 items-center">
            <div className="">
              <Link href={"/"}>
                <Image src={horizontalImage} alt="logo" width={150} />
              </Link>
            </div>
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
