import { FoodHeritage } from "@/app/constants/data";
import Divider from "../Divider";
import Image from "next/image";

interface PlaceContentProps {
  data: FoodHeritage;
}

export default function PlaceContent({ data }: PlaceContentProps) {
  return (
    <div>
      <div className={"relative h-50"}>
        <Image className={"object-cover"} src={data.imgSource} alt={"img"} fill />
      </div>
      <h3>{data.name}</h3>
      <div>
        <div className={"flex justify-between align-center"}>
          <label>{data.location.address}</label>
          <a href={data.location.gmapUrl} target={"_blank"}>
            <div className={"h-4 w-4 relative"}>
              <Image src={"/brands/gmap_icon.svg"} alt={"gmap"} fill />
            </div>
          </a>
        </div>
      </div>
      <Divider />
      <p>{data.desc}</p>
      <Divider />
      <div className={"flex flex-wrap gap-2 justify-center align-center"}>
        {data.awards?.map((v, i) => {
          return (
            <div key={`award-${v}-${i}`} className={"relative h-14 w-14"}>
              <Image src={`/brands/${v}.png`} fill alt={"award-logo"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
