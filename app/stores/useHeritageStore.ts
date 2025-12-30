import { create } from 'zustand';
import { EateryCategory, FoodHeritage, FoodMarqueeItem, ThemeColor } from '../types';
import { ClassValue } from 'clsx';
import { ThemeRecord } from '../constants/theme';
import { flatten } from '../utils';

type State = {
  heritageId: string | null;
  foodData: FoodHeritage[];
  filter: EateryCategory[];
};

type Actions = {
  setHeritageId: (newId: string | null) => void;
  setFilter: (cat: EateryCategory) => void;
  unsetFilter: (cat: EateryCategory) => void;
  getThemeStyle: () => ClassValue;
  unSelect: () => void;
  getFilteredFood: () => FoodHeritage[];
  setFoodData: (data: FoodHeritage[]) => void;
  getFoodData: () => FoodHeritage[];
  getSelectedFoodData: () => FoodHeritage | null;
  getFoodImages: () => FoodMarqueeItem[];
  getFoodDataById: (id: string) => FoodHeritage | null;
  reset: () => void;
};

export const useHeritageStore = create<State & Actions>((set, get) => ({
  heritageId: null,
  foodData: [],
  filter: ['hawker', 'dessert', 'restaurant'],
  reset: () => {
    set({
      heritageId: null,
      foodData: [],
      filter: ['hawker', 'dessert', 'restaurant'],
    });
  },
  setHeritageId: (newId: string | null) => set({ heritageId: newId }),
  setFilter: (newFilter: EateryCategory) =>
    set((state) => ({ filter: state.filter.concat([newFilter]) })),
  unsetFilter: (filter: EateryCategory) =>
    set((state) => {
      if (state.filter.length <= 1) {
        return state;
      }
      return { filter: state.filter.filter((x) => x !== filter) };
    }),
  unSelect: () => set({ heritageId: null }),
  getFilteredFood: () => {
    return get().foodData.filter((x) => get().filter.includes(x.category));
  },
  getThemeStyle: () => {
    const heritageId = get().heritageId;
    const foodData = get().foodData;
    let theme: ThemeColor = 'primary';
    if (heritageId) {
      const heritage = foodData.find((v) => v.id === heritageId);
      if (heritage) {
        theme = ThemeRecord[heritage.category];
      }
    }
    const themeStyle: ClassValue = {
      'bg-primary': !theme || theme === 'primary',
      'border-primary': theme && theme === 'primary',
      'bg-gardengreen': theme && theme === 'green',
      'border-gardengreen': theme && theme === 'green',
      'bg-monsoongrey': theme && theme === 'grey',
      'border-monsoongrey': theme && theme === 'grey',
      'bg-outramorange': theme && theme === 'orange',
      'border-outramorange': theme && theme === 'orange',
    };
    return themeStyle;
  },
  setFoodData: (data: FoodHeritage[]) => set({ foodData: data }),
  getFoodData: () => get().foodData,
  getSelectedFoodData: () => {
    const id = get().heritageId;
    const data = get().foodData;
    if (!id) return null;

    return data.find((i) => i.id === id) || null;
  },
  getFoodImages: () => {
    const data = get().foodData;
    const itemsArr: FoodMarqueeItem[][] = data.map((x) => {
      return x.imgSource.map((v) => ({ src: v, id: x.id }));
    });
    const arr = flatten<FoodMarqueeItem>(itemsArr);
    return arr;
  },
  getFoodDataById: (id: string) => {
    return get().foodData.find((x) => x.id === id) ?? null;
  },
}));
