import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="w-[1250px] m-auto px-16 py-8">{`© ${year} [Your Name] All Rights Reserved`}</div>
    </footer>
  );
};

export default Footer;
