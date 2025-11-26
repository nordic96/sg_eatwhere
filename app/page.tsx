import MapScene from "./components/MapScene/MapScene";
import Sidebar from "./components/Sidebar/Sidebar";
import withSuspense from "./functions/withSuspense";

function Home() {
  return (
    <div className={"w-[97vw] h-[80vh] overflow-hiden"}>
      <MapScene />
      <Sidebar />
    </div>
  );
}

export default withSuspense(Home, <p>Loading...</p>);
