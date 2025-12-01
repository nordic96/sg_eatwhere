import LabelContainer from "labelcontainer";
import FilterBar from "./components/FilterBar/FilterBar";
import MapScene from "./components/MapScene/MapScene";
import Sidebar from "./components/Sidebar/Sidebar";
import withSuspense from "./functions/withSuspense";

function Home() {
  const lsInstance = LabelContainer.getInstance();
  return (
    <div className={"relative flex flex-col grow h-[85vh] max-h-[900px] overflow-hiden pb-8"}>
      <FilterBar
        labels={{
          hawker: lsInstance.getLabel("filter_hawker"),
          restaurant: lsInstance.getLabel("filter_restaurants"),
          dessert: lsInstance.getLabel("filter_dessert"),
        }}
      />
      <MapScene />
      <Sidebar />
      <p className="italic text-[#333]">
        {
          "**The scale of the map is not precise, it is for rough estimation of the locations for each restaurants"
        }
      </p>
    </div>
  );
}

export default withSuspense(Home, <p>Loading...</p>);
