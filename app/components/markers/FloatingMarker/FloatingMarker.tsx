"use client";

import * as THREE from "three";
import { ReactNode, useRef } from "react";

import { ThreeElements, useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { useRiceBowlModel } from "../RiceBowlModel";

/** HTML */
import PlaceContent from "../../PlaceContent/PlaceContent";
import { Close } from "@mui/icons-material";
import { FoodHeritage } from "@/app/constants/data";
import { useHeritageStore } from "@/app/stores";

type FloatingMarkerProps = ThreeElements["group"] & {
  children: ReactNode;
  data: FoodHeritage;
  floatHeight?: number; // how high above the base model the indicator floats
};

export const FloatingMarker = ({
  children,
  position = [0, 0, 0],
  floatHeight = 2,
  data,
  ...props
}: FloatingMarkerProps) => {
  const { heritageId, setHeritageId, unSelect } = useHeritageStore();
  const riceBowl = useRiceBowlModel();
  const floatRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!floatRef.current) return;
    const t = state.clock.elapsedTime;

    floatRef.current.position.y = floatHeight + Math.sin(t * 1.4) * 0.3;
    floatRef.current.rotation.y = Math.sin(t * 0.8) * 0.3;
  });

  return (
    <group position={position} {...props}>
      {/* Base object (e.g., SongFa, MBS) */}
      <group>{children}</group>

      {/* Floating indicator above */}
      <group ref={floatRef} scale={1} onClick={() => setHeritageId(data.id)}>
        <primitive object={riceBowl} />
        <meshStandardMaterial emissive={"hotpink"} emissiveIntensity={2} toneMapped={false} />
      </group>
      {heritageId === data.id && (
        <Billboard position={[5, floatHeight + 10, 0]}>
          <Html>
            <div className={"flex w-[30vw] bg-white p-4 flex-col gap-2"}>
              <div onClick={unSelect}>
                <Close />
              </div>
              <PlaceContent data={data} />
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
};
