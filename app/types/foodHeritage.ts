export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  gmapUrl: string;
  geoLocation: GeoLocation;
}

export type Keyword = "halal" | "pork" | "chicken" | "seafood" | "dessert";

export const EateryCategoryValues = ["restaurant", "dessert", "hawker"] as const;
export type EateryCategory = (typeof EateryCategoryValues)[number];

export interface FoodHeritage {
  id: string;
  name: string;
  desc: string;
  category: EateryCategory;
  imgSource: string;
  location: Location;
  website?: string;
  keywords?: Keyword[];
  awards?: string[];
}
