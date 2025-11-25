import React from "react";
import withHeaderDesc from "../functions/withHeaderDesc";
import { projectData } from "../constants/projects";
import ProjectCard from "./ProjectCard";

function ProjectSection() {
  return (
    <div>
      {projectData.map((data) => {
        return <ProjectCard project={data} key={data.id} />;
      })}
    </div>
  );
}

export default withHeaderDesc(ProjectSection, "project");
