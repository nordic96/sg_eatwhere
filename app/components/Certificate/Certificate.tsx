import React from "react";
import Image from "next/image";

export interface Certificate {
  url: string;
  name: string;
  year_earned: string;
  icon_url: string;
}

interface CertificateProps {
  cert: Certificate;
}

function Certificate(props: CertificateProps) {
  const { url, name, year_earned, icon_url } = props.cert;
  return (
    <a href={url} target={"_blank"}>
      <div className="flex flex-col items-center border border-black w-32 px-2 py-4 rounded-md shadow-lg gap-2 text-center hover:bg-zinc-100 text-sm h-50">
        {year_earned}
        <div className="flex h-15">
          <Image src={icon_url} alt={""} width={60} height={60} />
        </div>
        {name}
      </div>
    </a>
  );
}

export default Certificate;
