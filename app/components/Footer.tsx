import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary">
      <div className="flex grow px-8 py-4">{`© ${year} Stephen Ko All Rights Reserved`}</div>
    </footer>
  );
};

export default Footer;
