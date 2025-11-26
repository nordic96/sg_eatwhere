import React from "react";
import Link from "next/link";
import LabelContainer from "labelcontainer";

const Header = () => {
  const lsInstance = LabelContainer.getInstance();
  return (
    <div>
      <header>
        <div className="flex justify-between grow px-8 py-2">
          <Link href={"/"}>{lsInstance.getLabel("header_title")}</Link>
          <div>
            <Link href={"/about"}>About</Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
