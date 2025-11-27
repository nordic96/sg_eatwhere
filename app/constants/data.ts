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
  {
    id: "hill_street_tai_hwa",
    name: "Hill Street Tai Hwa Pork Noodle",
    desc: "A legendary bak chor mee stall founded in the 1930s, famed for its vinegary minced meat noodles and long queues.",
    category: "hawker",
    imgSource: "https://danielfooddiary.com/wp-content/uploads/2020/09/taihwabcm1.jpg",
    location: {
      address: "466 Crawford Ln, #01-12, Singapore 190466",
      gmapUrl: "https://maps.app.goo.gl/7y8a2vWXq3r2xvVW9",
      geoLocation: {
        latitude: 1.3053195659241765,
        longitude: 103.86303995673765,
      },
    },
    website: "https://www.facebook.com/TaiHwaPorkNoodle/",
    keywords: ["pork"],
    awards: ["michelin_2025"],
  },
  {
    id: "komalas_vilas",
    name: "Komala Vilas",
    desc: "One of Singapore’s oldest Indian vegetarian restaurants, established in 1947 and beloved for its traditional South Indian cuisine.",
    category: "restaurant",
    imgSource:
      "https://www.komalavilas.com.sg/wp-content/uploads/2020/08/KomalaVilas-shopfront.jpg",
    location: {
      address: "76 Serangoon Rd, Singapore 217981",
      gmapUrl: "https://maps.app.goo.gl/nQxPWjqA9NnKiUfK6",
      geoLocation: {
        latitude: 1.307901,
        longitude: 103.853522,
      },
    },
    website: "https://www.komalavilas.com.sg/",
    keywords: ["halal", "dessert"],
    awards: ["heritage_restaurant_award"],
  },
  {
    id: "jin_hu_lim_chee_chee_rojak",
    name: "Lim Kee (Orchard Road) Rojak",
    desc: "One of Singapore’s longest-standing rojak stalls, serving the iconic fruit-and-dough fritter salad with traditional prawn paste.",
    category: "hawker",
    imgSource: "https://sethlui.com/wp-content/uploads/2023/02/Orchard-Rojak-stallfront.jpg",
    location: {
      address: "283 Jalan Besar, Singapore 208947",
      gmapUrl: "https://maps.app.goo.gl/i1qhATC6QgR5c2BU6",
      geoLocation: {
        latitude: 1.310853,
        longitude: 103.85645,
      },
    },
    keywords: ["dessert", "seafood"],
    awards: ["heritage_hawker_2023"],
  },
  {
    id: "hua_fong_chicken_rice",
    name: "Hainanese Delicacy",
    desc: "An old-school Hainanese chicken rice spot located inside Far East Plaza, beloved for its traditional flavours and comfort-focused cooking.",
    category: "restaurant",
    imgSource: "https://sethlui.com/wp-content/uploads/2022/04/Hainanese-Delicacy-shopfront.jpg",
    location: {
      address: "14 Scotts Rd, #05-116, Singapore 228213",
      gmapUrl: "https://maps.app.goo.gl/qvC3B65qVkbppYxg7",
      geoLocation: {
        latitude: 1.305259,
        longitude: 103.832228,
      },
    },
    keywords: ["chicken"],
    awards: [],
  },
  {
    id: "tong_heng_pastry",
    name: "Tong Heng Traditional Cantonese Pastries",
    desc: "Famous since the 1930s for its diamond-shaped egg tarts and classic Cantonese pastries, Tong Heng is one of Singapore’s oldest confectioneries.",
    category: "dessert",
    imgSource: "https://danielfooddiary.com/wp-content/uploads/2020/08/tongheng1.jpg",
    location: {
      address: "285 South Bridge Rd, Singapore 058833",
      gmapUrl: "https://maps.app.goo.gl/M4G5U3v8yVQMYKdE8",
      geoLocation: {
        latitude: 1.28181,
        longitude: 103.845534,
      },
    },
    website: "https://tongheng.com.sg/",
    keywords: ["dessert"],
    awards: ["heritage_brand_singapore"],
  },
];
