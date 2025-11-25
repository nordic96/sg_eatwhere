import React from "react";
import withHeaderDesc from "../functions/withHeaderDesc";
import { techStackData } from "../constants/techstacks";
import TechStack from "./TechStack/TechStack";

function SkillsSection() {
  return (
    <div className={"flex flex-wrap gap-2"}>
      {techStackData.map((skill, i) => (
        <TechStack skill={skill} key={i} />
      ))}
    </div>
  );
}

export default withHeaderDesc(SkillsSection, "skills");
