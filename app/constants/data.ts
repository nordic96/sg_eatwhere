import { EateryCategory, FoodHeritage } from '@/app/types';

export const CAT_ASSET_MAP: Record<EateryCategory, string> = {
  hawker: '/images/hawker_bowl.svg',
  restaurant: '/images/rooter_bowl.svg',
  dessert: '/images/hawker_bowl.svg',
};

export const data: FoodHeritage[] = [
  {
    id: 'komala',
    name: 'Komala Vilas',
    category: 'restaurant',
    recommendations: ['Masla Dosai', 'Masala Chai'],
    imgSource: [
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/komala/komalavilla_1.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/komala/komalavilla_2.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/komala/komalavilla_3.jpeg',
    ],
    location: {
      address: '76 Serangoon Rd, Singapore 217981',
      gmapUrl: 'https://maps.app.goo.gl/k7tFGxx6g8q9ooL49',
      mrt: ['little_india'],
      region: 'central',
      geoLocation: {
        latitude: 1.307901,
        longitude: 103.853522,
      },
    },
    website: 'https://www.komalavilas.com.sg/',
  },
  {
    id: 'spicy_wife',
    name: 'Spicy Wife Nasi Lemak',
    category: 'hawker',
    recommendations: ['Aromatic Chicken'],
    imgSource: [
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/spicy/spicy_wife_1.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/spicy/spicy_wife_2.jpeg',
    ],
    location: {
      address: '7 Maxwell Rd, Amoy St, Food Centre, 02-119, 069111',
      gmapUrl: 'https://maps.app.goo.gl/hmquZSaXGugMDH4q8',
      mrt: ['tanjong_pagar'],
      region: 'central',
      geoLocation: {
        latitude: 1.2792477058866272,
        longitude: 103.84652104460396,
      },
    },
  },
  {
    id: 'yatkayan',
    name: 'Yat Ka Yan Dessert',
    category: 'dessert',
    recommendations: ['Yam Chendol', 'Purple Rice with Icecream'],
    imgSource: [
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/yatkayan/yatkayan_1.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/yatkayan/yatkayan_2.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/yatkayan/yatkayan_3.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/yatkayan/yatkayan_4.jpeg',
    ],
    location: {
      address: '190 Middle Rd, #02-08 Fortune Centre, Singapore 188979',
      gmapUrl: 'https://maps.app.goo.gl/kAc8EuW5MqgZDbWQA',
      mrt: ['bencoolen'],
      region: 'central',
      geoLocation: {
        latitude: 1.3007023528612611,
        longitude: 103.85208220385952,
      },
    },
  },
  {
    id: 'nanhuachang',
    name: 'Nan Hua Chang SeaFood',
    category: 'restaurant',
    recommendations: ['Grouper Fish Head Steamboat', 'Prawn Paste Wings'],
    imgSource: [
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/nanhua/nanhuachang_1.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/nanhua/nanhuachang_2.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/nanhua/nanhuachang_3.jpeg',
    ],
    location: {
      address: '462 Crawford Ln, #01-69/71, Singapore 190462',
      gmapUrl: 'https://maps.app.goo.gl/mBPhoS7j188iqBzv9',
      mrt: ['lavender', 'bugis', 'nicoll_highway'],
      region: 'central',
      geoLocation: {
        latitude: 1.3050929262076814,
        longitude: 103.86270769767101,
      },
    },
    website: 'https://nanhwachong.com.sg/',
  },
  {
    id: 'jixiang',
    name: 'Ji Xiang Confectionery',
    category: 'dessert',
    recommendations: ['Yam AngKuKueh', 'Sweet Bean AngKuKueh'],
    imgSource: [
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/jixiang/jixiang_1.jpeg',
    ],
    location: {
      address: '1 Everton Park, #01-33, Singapore 081001',
      gmapUrl: 'https://maps.app.goo.gl/SJmoZAJ9NkfEEoau6',
      mrt: ['outram_park', 'tanjong_pagar'],
      region: 'central',
      geoLocation: {
        latitude: 1.277494311833965,
        longitude: 103.84025398917902,
      },
    },
    website: 'https://jixiangeverton.com.sg/',
  },
  {
    id: 'oldtree',
    name: '99 Old Trees Durian',
    category: 'dessert',
    recommendations: ['Stinky Bowl (with Extra Shot)', 'MaoShanWang Durian Chendol'],
    imgSource: [
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/oldtree/oldtree_3.jpeg',
      'https://cdn.jsdelivr.net/gh/nordic96/sg_eatwhere/resources/oldtree/oldtree_1.jpeg',
    ],
    location: {
      address: '1 Teo Hong Rd, Singapore 088321',
      gmapUrl: 'https://maps.app.goo.gl/gqcUMstgvKDpAsZ7A',
      mrt: ['outram_park', 'tanjong_pagar'],
      region: 'central',
      geoLocation: {
        latitude: 1.280484583904037,
        longitude: 103.84097249373312,
      },
    },
    website: 'https://www.99oldtrees.com/',
  },
];
