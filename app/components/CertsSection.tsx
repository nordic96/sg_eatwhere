import React from "react";
import withHeaderDesc from "../functions/withHeaderDesc";
import { certsData } from "../constants/certs";
import Certificate from "./Certificate/Certificate";

function CertsSection() {
  return (
    <div className="flex flex-wrap gap-4">
      {certsData.map((cert, id) => (
        <Certificate key={id} cert={cert} />
      ))}
    </div>
  );
}

export default withHeaderDesc(CertsSection, "certs");
