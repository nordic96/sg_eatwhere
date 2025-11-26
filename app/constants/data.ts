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

export const data: FoodHeritage[] = [
  {
    id: "songfa",
    name: "Song Fa Bak Kut Teh",
    desc: "Founded in 1969, Song Fa Bak Kut Teh was one of the oldest bak kut teh restaurant that first started as a pushcart near Johor Road",
    category: "restaurant",
    imgSource: "https://songfa.com.sg/cdn/shop/files/desktop_tiny_1439x400@2x.png?v=1613171984",
    location: {
      address: "11 New Bridge Rd, #01-01, Singapore 059383",
      gmapUrl: "https://maps.app.goo.gl/XNYQHX7uYPXfA3f76",
      geoLocation: {
        latitude: 1.2890347925294459,
        longitude: 103.84776780251772,
      },
    },
    website: "https://songfa.com.sg/",
    keywords: ["pork"],
    awards: ["michelin_2025", "made_with_passion_sg"],
  },
];
