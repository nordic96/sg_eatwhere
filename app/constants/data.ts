import { EateryCategory, FoodHeritage } from '@/app/types';

export const CAT_ASSET_MAP: Record<EateryCategory, string> = {
  hawker: '/images/hawker_bowl.svg',
  restaurant: '/images/rooter_bowl.svg',
  dessert: '/images/hawker_bowl.svg',
};

export const data: FoodHeritage[] = [
  {
    id: 'komalas_vilas',
    name: 'Komala Vilas',
    category: 'restaurant',
    recommendations: ['Masla Dosai'],
    imgSource: [
      'https://www.dropbox.com/scl/fi/b80ge1updxlqpypo3wjdi/komalavilla_1.jpeg?rlkey=5xmrck0m2ooj574c7jah3kvn6&st=q1ecwz63&raw=1',
      'https://www.dropbox.com/scl/fi/0xzheor1cefaamhvclc8h/komalavilla_2.jpeg?rlkey=x32h374aswbnp66ewxaudx6xo&st=hw8jd6z3&raw=1',
      'https://www.dropbox.com/scl/fi/6cia6odl9n26civfy81n8/komalavilla_3.jpeg?rlkey=ao1347ujz9gr5910cjsmt9b5y&st=xtnsvfqo&raw=1',
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
    recommendations: ['aroma_chicken'],
    imgSource: [
      'https://www.dropbox.com/scl/fi/kvk8jwx6vjg5179btr05i/spicy_wife_1.jpeg?rlkey=mce4jjtvp34xartf2ji3i9ymb&st=bp1yqc6m&raw=1',
      'https://www.dropbox.com/scl/fi/jj7y8hliluv2mrwis8ncg/spicy_wife_2.jpeg?rlkey=ppegoqv5e4hgpn6z0jvkqi7vr&st=i66tss1d&raw=1',
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
    recommendations: ['Durian Chendol', 'Purple Rice with Icecream'],
    imgSource: [
      'https://www.dropbox.com/scl/fi/jtmyupd7bdu1665epxqmc/yatkayan_1.jpeg?rlkey=66gqlgfyc19852542e0uixd1n&st=ppikkcnu&raw=1',
      'https://www.dropbox.com/scl/fi/8ve3tapsitlhxeye1n617/yatkayan_2.jpeg?rlkey=ide4d8nipj2srolxdcjbn65ln&st=ew5jvt7j&raw=1',
      'https://www.dropbox.com/scl/fi/qblw9f7d23wqapubecj5q/yatkayan_3.jpeg?rlkey=vorart56p46ay2mhxkn6k1af9&st=dzl7syc6&raw=1',
      'https://www.dropbox.com/scl/fi/yij93r59t6tklu3zbr1mh/yatkayan_4.jpeg?rlkey=agcccvv1r2op4l738jlowmixc&st=czgcczx4&raw=1',
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
      'https://www.dropbox.com/scl/fi/wd7x9t9zl7rmj00l0wwek/nanhuachang_1.jpeg?rlkey=y19ip0jrw8t6aixhwxmozuaeb&st=vyjswdw1&raw=1',
      'https://www.dropbox.com/scl/fi/b2u7zent64n25d5iice9z/nanhuachang_2.jpeg?rlkey=yo4i67vceqyaxmrrjasucgol2&st=3x5uvqnd&raw=1',
      'https://www.dropbox.com/scl/fi/jp1q86nc0ot5tkdknuk4o/nanhuachang_3.jpeg?rlkey=x7xz3mwe0e5rwwhvaffsu4rox&st=b1mrtryq&raw=1',
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
      'https://www.dropbox.com/scl/fi/gbd9n8hba3gupskgpu5hz/jixiang_1.jpeg?rlkey=qd1hdjbqwmtwm9vt9m3g89s7q&st=w2zchi3u&raw=1',
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
    recommendations: ['MaoShanWang Durian Chendol', 'Durian Mousse'],
    imgSource: [
      'https://www.dropbox.com/scl/fi/luzbn6evsjcnxu7w815lx/oldtree_3.jpeg?rlkey=7ztnpo7z8zjcne8byb51p17qd&st=m4yy8mhd&raw=1',
      'https://www.dropbox.com/scl/fi/oypbynnlcauxj8lwsvcwl/oldtree_1.jpeg?rlkey=msncgbf4sx4lznocgyonhp4ql&st=0bb9402w&raw=1',
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
