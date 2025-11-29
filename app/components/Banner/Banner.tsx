"use client";
import Close from "@mui/icons-material/Close";

export interface BannerProps {
  msg?: string;
}

export default function Banner({ msg }: BannerProps) {
  const onClose = () => {
    const bannerEl = document.getElementById("banner");
    bannerEl?.classList.toggle("hidden");
  };

  return (
    <div id="banner" className="flex bg-goldenmile justify-center font-bold">
      <div className="flex grow px-8 py-1 max-w-[1440px] justify-between items-center">
        {msg}
        <div onClick={onClose}>
          <Close />
        </div>
      </div>
    </div>
  );
}
