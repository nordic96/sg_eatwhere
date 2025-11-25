"use client";
import React, { useState } from "react";
import Image from "next/image";
import Divider from "../Divider";
import { Source } from "@/app/types/source";

export interface Project {
  id: string;
  keywords: string[];
  name: string;
  year: string;
  desc: string;
  sources: Source[];
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard(props: ProjectCardProps) {
  const [toggle, setToggle] = useState<boolean>(false);

  const { name, year, desc, sources, keywords } = props.project;
  return (
    <div className="flex rounded-lg py-8 px-4 shadow-xl justify-between">
      <div className="flex flex-col gap-1 max-w-70">
        <label className="text-xl font-semibold">{`[${year}] ${name}`}</label>
        <Divider />
        <div className="flex gap-1 items-center flex-wrap">
          {sources.map((source, id) => (
            <a key={id} href={source.source_url} target={"_blank"}>
              <Image src={source.icon_url} width={25} height={25} alt={"source_logo"} />
            </a>
          ))}
          {keywords.map((keyword, id) => (
            <p className="text-sm" key={id}>{`#${keyword}`}</p>
          ))}
        </div>
        <div className="transition-all duration-500 ease-in-out"></div>
      </div>
      <div
        className="max-w-60 cursor-pointer"
        onMouseOver={() => setToggle(true)}
        onMouseLeave={() => setToggle(false)}
      >
        <p
          className={`
            overflow-hidden
            transition-all duration-500 ease-in-out
            ${toggle ? "max-h-96" : "max-h-12"}
          `}
        >
          {desc}
        </p>

        {/* fade-out overlay when collapsed */}
        {!toggle && (
          <div className="pointer-events-none -mt-6 h-6 w-full bg-linear-to-b from-transparent to-white" />
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
