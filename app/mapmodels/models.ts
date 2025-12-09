'use client';

import { useGLTF } from '@react-three/drei';

export const MODELS = {
  riceBowl: '/models/rice_bowl.glb',
  hawkerStall: '/models/hawker_stall_opt.glb',
  shophouse: '/models/shophouse_A_opt.glb',
  locationpin: '/models/location_pin.glb',
};

export function useModel(name: keyof typeof MODELS) {
  return useGLTF(MODELS[name]);
}

Object.values(MODELS).forEach((path) => {
  useGLTF.preload(path);
});
