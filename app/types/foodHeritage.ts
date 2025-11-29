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

export type EateryCategory = "restaurant" | "dessert" | "hawker";

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
