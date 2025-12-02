import React from "react";

interface DividerProps {
  className?: string;
}

const Divider = (props: DividerProps) => {
  const { className } = props;
  return <hr className={className ?? "my-1 lg:w-full max-sm:w-full"} />;
};

export default Divider;
