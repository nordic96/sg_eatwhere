import { EateryCategory } from '../types';

const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE;
export const MODEL_MAP: Record<EateryCategory, string> = {
  restaurant: `${CDN_BASE}/resources/models/shophouse_A_opt.glb`,
  dessert: `${CDN_BASE}/resources/models/shophouse_B_opt.glb`,
  hawker: `${CDN_BASE}/resources/models/hawker_stall_opt.glb`,
};
