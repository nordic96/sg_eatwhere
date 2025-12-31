'use client';

import { useGLTF } from '@react-three/drei';
import { isProductionMode } from '../utils';

const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE || '';
export const MODELS = {
  riceBowl: `${CDN_BASE}/resources/models/rice_bowl.glb`,
  hawkerStall: `${CDN_BASE}/resources/models/hawker_stall_opt.glb`,
  shophouse: `${CDN_BASE}/resources/models/shophouse_A_opt.glb`,
  locationpin: `${CDN_BASE}/resources/models/location_pin.glb`,
};

export function useModel(name: keyof typeof MODELS) {
  return useGLTF(MODELS[name]);
}

if (isProductionMode()) {
  Object.values(MODELS).forEach((path) => {
    useGLTF.preload(path);
  });
}
