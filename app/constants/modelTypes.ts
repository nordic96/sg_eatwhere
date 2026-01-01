import { CDN_BASE } from '../config/cdn';
import { EateryCategory } from '../types';

export const MODEL_MAP: Record<EateryCategory, string> = {
  restaurant: `${CDN_BASE}/resources/models/shophouse_A_opt.glb`,
  dessert: `${CDN_BASE}/resources/models/shophouse_B_opt.glb`,
  hawker: `${CDN_BASE}/resources/models/hawker_stall_opt.glb`,
};
