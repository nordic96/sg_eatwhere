import { FoodHeritage } from "@/app/types";

export const data: FoodHeritage[] = [
  {
    id: "komalas_vilas",
    name: "Komala Vilas",
    desc: "One of Singapore’s oldest Indian vegetarian restaurants, established in 1947 and beloved for its traditional South Indian cuisine.",
    category: "restaurant",
    bestDish: ["Masla Dosai"],
    imgSource: [
      "https://www.dropbox.com/scl/fi/b80ge1updxlqpypo3wjdi/komalavilla_1.jpeg?rlkey=5xmrck0m2ooj574c7jah3kvn6&st=q1ecwz63&raw=1",
      "https://www.dropbox.com/scl/fi/0xzheor1cefaamhvclc8h/komalavilla_2.jpeg?rlkey=x32h374aswbnp66ewxaudx6xo&st=hw8jd6z3&raw=1",
      "https://www.dropbox.com/scl/fi/6cia6odl9n26civfy81n8/komalavilla_3.jpeg?rlkey=ao1347ujz9gr5910cjsmt9b5y&st=xtnsvfqo&raw=1",
    ],
    location: {
      address: "76 Serangoon Rd, Singapore 217981",
      gmapUrl: "https://maps.app.goo.gl/k7tFGxx6g8q9ooL49",
      mrt: ["Little India"],
      geoLocation: {
        latitude: 1.307901,
        longitude: 103.853522,
      },
    },
    website: "https://www.komalavilas.com.sg/",
  },
  {
    id: "spicy_wife",
    name: "Spicy Wife Nasi Lemak",
    desc: "Best Nasi Lemak",
    category: "hawker",
    bestDish: ["aroma_chicken"],
    imgSource: [
      "https://www.dropbox.com/scl/fi/kvk8jwx6vjg5179btr05i/spicy_wife_1.jpeg?rlkey=mce4jjtvp34xartf2ji3i9ymb&st=bp1yqc6m&raw=1",
      "https://www.dropbox.com/scl/fi/jj7y8hliluv2mrwis8ncg/spicy_wife_2.jpeg?rlkey=ppegoqv5e4hgpn6z0jvkqi7vr&st=i66tss1d&raw=1",
      "https://www.dropbox.com/scl/fi/0d2pi8nmaw5b1yoieo8wb/spicy_wife_3.jpeg?rlkey=72ooea12admvt6221riqma2nn&st=bp06g11o&raw=1",
    ],
    location: {
      address: "7 Maxwell Rd, Amoy St, Food Centre, 02-119, 069111",
      gmapUrl: "https://maps.app.goo.gl/hmquZSaXGugMDH4q8",
      mrt: ["Tanjong Pagar"],
      geoLocation: {
        latitude: 1.2792477058866272,
        longitude: 103.84652104460396,
      },
    },
  },
  {
    id: "yatkayan",
    name: "Yat Ka Yan Dessert",
    desc: "Cantonese dessert",
    category: "dessert",
    bestDish: ["Durian Chendol", "Purple Rice with Icecream"],
    imgSource: [
      "https://www.dropbox.com/scl/fi/jtmyupd7bdu1665epxqmc/yatkayan_1.jpeg?rlkey=66gqlgfyc19852542e0uixd1n&st=ppikkcnu&raw=1",
      "https://www.dropbox.com/scl/fi/8ve3tapsitlhxeye1n617/yatkayan_2.jpeg?rlkey=ide4d8nipj2srolxdcjbn65ln&st=ew5jvt7j&raw=1",
      "https://www.dropbox.com/scl/fi/qblw9f7d23wqapubecj5q/yatkayan_3.jpeg?rlkey=vorart56p46ay2mhxkn6k1af9&st=dzl7syc6&raw=1",
      "https://www.dropbox.com/scl/fi/yij93r59t6tklu3zbr1mh/yatkayan_4.jpeg?rlkey=agcccvv1r2op4l738jlowmixc&st=czgcczx4&raw=1",
    ],
    location: {
      address: "190 Middle Rd, #02-08 Fortune Centre, Singapore 188979",
      gmapUrl: "https://maps.app.goo.gl/kAc8EuW5MqgZDbWQA",
      mrt: ["Bencoolen"],
      geoLocation: {
        latitude: 1.3007023528612611,
        longitude: 103.85208220385952,
      },
    },
  },
];
