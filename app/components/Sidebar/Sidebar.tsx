"use client";

import { data } from "@/app/constants/data";
import useClickOutside from "@/app/hooks/useClickOutside";
import { useRef, useEffect } from "react";
import PlaceContent from "../PlaceContent/PlaceContent";

export function openSidebar() {
  const sidebar = document.getElementById("list-sidebar");
  sidebar?.classList.remove("translate-x-full", "opacity-0");
  sidebar?.classList.add("translate-x-0", "opacity-100");
}

export function closeSidebar() {
  const toggleButton = document.getElementById("list-sidebar");
  if (toggleButton !== null) {
    toggleButton.classList.remove("translate-x-0", "opacity-100");
    toggleButton.classList.add("translate-x-full", "optacity-0");
  }
}

export default function Sidebar() {
  const target = useRef(null);
  useClickOutside(target, () => closeSidebar());
  const selectedData = data.filter((x) => x.id === "songfa")[0];

  useEffect(() => {
    openSidebar();
  }, []);

  const onClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    closeSidebar();
  };

  return (
    <div
      id="list-sidebar"
      ref={target}
      className="fixed flex flex-col right-0 bg-white top-9 grow px-8 py-8 min-w-[300px] w-[30vw] max-w-[500px] min-h-[80.5vh] transform translate-x-full opacity-0 transition-transform duration-500 ease-in-out"
    >
      <div className="flex justify-end font-bold">
        <button onClick={onClose}>X</button>
      </div>
      <PlaceContent data={selectedData} />
    </div>
  );
}
