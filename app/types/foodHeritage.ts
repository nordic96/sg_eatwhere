export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  gmapUrl: string;
  mrt: string[];
  region: Region;
  geoLocation: GeoLocation;
}

export type Region = 'central' | 'east' | 'west' | 'north';

export const EateryCategoryValues = ['restaurant', 'dessert', 'hawker'] as const;
export type EateryCategory = (typeof EateryCategoryValues)[number];

export interface FoodHeritage {
  id: string;
  name: string;
  recommendations: string[];
  category: EateryCategory;
  imgSource: string[];
  location: Location;
  website?: string;
}
