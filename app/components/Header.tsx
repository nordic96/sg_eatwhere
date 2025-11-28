import React from "react";
import Link from "next/link";
import Image from "next/image";
import horizontalImage from "@/public/images/header_icon.svg";

const Header = () => {
  return (
    <div>
      <header className="bg-primary text-white shadow-lg">
        <div className="flex items-center justify-between grow px-8 py-2 shadow-lg">
          <div className="flex gap-1 items-center">
            <div className="">
              <Link href={"/"}>
                <Image src={horizontalImage} alt="logo" height={60} />
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
