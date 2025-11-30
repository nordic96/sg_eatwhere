/* eslint-disable no-unused-vars */
import Close from "@mui/icons-material/Close";
import React from "react";

interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export default function CloseButton(props: CloseButtonProps) {
  return (
    <div
      className="bg-primary w-6 h-6 cursor-pointer rounded-xl text-center text-white"
      onClick={props.onClick}
    >
      <Close />
    </div>
  );
}
