/* eslint-disable @next/next/no-img-element */
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className={"flex grow pt-8 justify-center"}>
        <div className="flex flex-col grow max-w-[1440px] px-8 justify-between">
          <div className="gap-8 flex">
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
        </div>
      </footer>
      <div className="flex mt-8 py-2 bg-[#333] text-white justify-center">
        <div className="flex flex-col grow max-w-[1440px] px-8">
          <p>{`© ${year} Stephen Ko All Rights Reserved`}</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
