import React from "react";

const Description = (props: React.PropsWithChildren<unknown>) => {
  const { children } = props;
  return <div className={"flex text-md max-sm:text-base max-sm:w-full"}>{children}</div>;
};

export default Description;
