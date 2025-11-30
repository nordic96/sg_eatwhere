"use client";

import useClickOutside from "@/app/hooks/useClickOutside";
import { useRef } from "react";

import CloseButton from "../CloseButton/CloseButton";
import { useHeritageStore } from "@/app/stores";

export default function Sidebar() {
  const target = useRef(null);
  const { closeMore } = useHeritageStore();

  useClickOutside(target, closeMore);

  const onClose = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMore();
  };

  return (
    <div
      id="list-sidebar"
      ref={target}
      className="fixed flex flex-col right-0 bg-white rounded-xl shadow-xl top-[58px] grow p-4 w-[384px] h-[85vh] max-h-[800px] transform translate-x-full opacity-0 transition-transform duration-500 ease-in-out"
    >
      <div className="flex justify-end">
        <CloseButton onClick={onClose} />
      </div>
      {/* <PlaceContent /> */}
    </div>
  );
}
