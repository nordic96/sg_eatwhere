import React from "react";
import Image from "next/image";
import LabelContainer from "labelcontainer";
import { Profile, profileData } from "../constants/profiles";
import CertsSection from "./CertsSection";

const IntroSection = () => {
  const lsInstance = LabelContainer.getInstance();
  return (
    <div className="flex flex-col gap-6 max-w-[400px]">
      <div className="w-[300px] h-[300px] bg-gray-900 rounded-[150px] shadow-2xl">&nbsp;</div>
      <div>
        <h1>{lsInstance.getLabel("intro_name")}</h1>
        <h3>{lsInstance.getLabel("intro_secondary")}</h3>
        <label>{lsInstance.getLabel("intro_desc")}</label>
        <div className="flex gap-2 items-center mt-4">
          {profileData.map((p, key) => {
            return <MemoisedProfileIcon key={key} profile={p} />;
          })}
        </div>
      </div>
      <div>
        <a
          href=""
          target="_blank"
          className={"bg-red-600 px-4 py-3 text-white rounded-md hover:bg-red-700"}
        >
          {lsInstance.getLabel("btn_resume")}
        </a>
      </div>
      <CertsSection />
    </div>
  );
};

interface ProfileIconProps {
  profile: Profile;
}

function ProfileIcon(props: ProfileIconProps) {
  const { url, icon_url, type } = props.profile;
  return (
    <div>
      <a href={url} target={"_blank"}>
        <Image src={icon_url} alt={type} width={24} height={24} />
      </a>
    </div>
  );
}

const MemoisedProfileIcon = React.memo(ProfileIcon);
export default IntroSection;
