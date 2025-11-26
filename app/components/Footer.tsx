import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="flex grow px-8 py-4">{`© ${year} [Your Name] All Rights Reserved`}</div>
    </footer>
  );
};

export default Footer;
