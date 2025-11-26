import { ThreeElements } from "@react-three/fiber";

export default function MBSPlaceholder(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* Three towers */}
      {[-1, 0, 1].map((x, i) => (
        <mesh key={i} position={[x * 0.6, 0.6, 0]}>
          <boxGeometry args={[0.5, 1.2, 0.5]} />
          <meshStandardMaterial color={"#888"} />
        </mesh>
      ))}

      {/* SkyPark on top */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[2.2, 0.25, 0.6]} />
        <meshStandardMaterial color={"#bfbfbf"} />
      </mesh>
    </group>
  );
}
