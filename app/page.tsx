import MapScene from "./components/MapScene/MapScene";
import Sidebar from "./components/Sidebar/Sidebar";
import withSuspense from "./functions/withSuspense";

function Home() {
  return (
    <div className={"w-full h-[85vh] overflow-hiden pb-8"}>
      <MapScene />
      <Sidebar />
    </div>
  );
}

export default withSuspense(Home, <p>Loading...</p>);
