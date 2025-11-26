import MapScene from "./components/MapScene/MapScene";
import withSuspense from "./functions/withSuspense";

function Home() {
  return (
    <div className={"w-[97vw] h-[80vh] overflow-hiden"}>
      <MapScene />
    </div>
  );
}

export default withSuspense(Home, <p>Loading...</p>);
