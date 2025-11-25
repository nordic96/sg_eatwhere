import React from "react";
import Image from "next/image";
import { Source } from "@/app/types/source";

export interface Skill {
  name: string;
  source: Source;
}

interface TechStackProps {
  skill: Skill;
}

function TechStack({ skill }: TechStackProps) {
  const { name, source } = skill;
  return (
    <div
      className={
        "flex flex-col justify-center w-17 py-1 border-black border rounded-md items-center"
      }
    >
      <div>
        <Image src={source.icon_url} alt={"logo"} height={30} width={30} />
      </div>
      <p className="text-sm">{name}</p>
    </div>
  );
}

export default TechStack;
