/* eslint-disable @next/next/no-img-element */
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={"box-border px-8 py-8"}>
      <div className="flex gap-8">
        <div className="w-[200px]">
          <img src={"/images/foodies_trail_sg_header_icon.svg"} alt={"logo"} />
        </div>
        <div className="box-border grid grid-cols-3 w-[500px] gap-8">
          <div className="">
            <p className="font-bold">View Restaurant List</p>
            <div className="">
              <p>Foodie Trail</p>
              <p>Dessert Trail</p>
              <p>Heritage Trail</p>
            </div>
          </div>
          <div className="">
            <p className="font-bold">View Restaurant List</p>
            <div className="">
              <p>Foodie Trail</p>
              <p>Dessert Trail</p>
              <p>Heritage Trail</p>
              <p>Heritage Trail</p>
              <p>Heritage Trail</p>
            </div>
          </div>
          <div className="">
            <p className="font-bold">View Restaurant List</p>
            <div className="">
              <p>Foodie Trail</p>
              <p>Dessert Trail</p>
              <p>Heritage Trail</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end h-10">
        <p>{`© ${year} Stephen Ko All Rights Reserved`}</p>
      </div>
    </footer>
  );
};

export default Footer;
