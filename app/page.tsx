"use client";

import LabelContainer from "labelcontainer";
import FilterBar from "./components/FilterBar/FilterBar";
import MapScene from "./components/MapScene/MapScene";
import Sidebar from "./components/Sidebar/Sidebar";
import withSuspense from "./functions/withSuspense";
import { useHeritageStore } from "./stores";
import HeritageListView from "./components/HeritageListView/HeritageListView";

function Home() {
  const lsInstance = LabelContainer.getInstance();
  const {} = useHeritageStore();
  return (
    <div className={"relative flex flex-col grow overflow-hiden pb-8"}>
      <FilterBar
        labels={{
          hawker: lsInstance.getLabel("filter_hawker"),
          restaurant: lsInstance.getLabel("filter_restaurants"),
          dessert: lsInstance.getLabel("filter_dessert"),
        }}
      />
      <div className="h-[75vh] max-h-[800px]">
        <MapScene />
      </div>
      <Sidebar />
      <p className="italic text-[#333]">
        {
          "**The scale of the map is not precise, it is for rough estimation of the locations for each restaurants"
        }
      </p>
      <div className="flex grow justify-between mt-8">
        {/** Food List Container */}
        <div className="grid grid-cols-4 w-[60%]">
          <HeritageListView region={"central"} />
          <HeritageListView region={"east"} />
          <HeritageListView region={"west"} />
          <HeritageListView region={"north"} />
        </div>
        {/** Gmap List Container */}
        <div></div>
      </div>
    </div>
  );
}

export default withSuspense(Home, <p>Loading...</p>);
