import { create } from 'zustand';
import { EateryCategory, FoodHeritage, ThemeColor } from '../types';
import { ClassValue } from 'clsx';
import { ThemeRecord } from '../constants/theme';
import { findCentroid, generateRandomArr, geoConverter } from '../utils';

type State = {
  heritageId: string | null;
  foodData: FoodHeritage[];
  trailIds: string[];
  filter: EateryCategory[];
  clickedMore: boolean;
  trailMode: boolean;
};

type Actions = {
  setHeritageId: (newId: string | null) => void;
  setFilter: (cat: EateryCategory) => void;
  unsetFilter: (cat: EateryCategory) => void;
  getThemeStyle: () => ClassValue;
  openMore: () => void;
  closeMore: () => void;
  unSelect: () => void;
  toggleTrailMode: () => void;
  getFilteredFood: () => FoodHeritage[];
  getFilteredTrails: () => string[];
  moveToNextTrail: (reverse?: boolean) => number;
  setFoodData: (data: FoodHeritage[]) => void;
  getFoodData: () => FoodHeritage[];
  getSelectedFoodData: () => FoodHeritage | null;
  reset: () => void;
};

export function openSidebar() {
  const sidebar = document.getElementById('list-sidebar');
  sidebar?.classList.remove('translate-y-[-120%]', 'opacity-0');
  sidebar?.classList.add('translate-y-0', 'opacity-100');
}

export function closeSidebar() {
  const toggleButton = document.getElementById('list-sidebar');
  if (toggleButton !== null) {
    toggleButton.classList.remove('translate-y-0', 'opacity-100');
    toggleButton.classList.add('translate-y-[-120%]', 'optacity-0');
  }
}

export const useHeritageStore = create<State & Actions>((set, get) => ({
  heritageId: null,
  foodData: [],
  filter: ['hawker', 'dessert', 'restaurant'],
  clickedMore: false,
  trailMode: false,
  trailIds: [],
  reset: () => {
    set({
      heritageId: null,
      foodData: [],
      filter: ['hawker', 'dessert', 'restaurant'],
      clickedMore: false,
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
  openMore: () => {
    set({ clickedMore: true });
    openSidebar();
  },
  closeMore: () => {
    set({ clickedMore: false });
    closeSidebar();
  },
  unSelect: () => set({ heritageId: null }),
  getFilteredFood: () => {
    return get().foodData.filter((x) => get().filter.includes(x.category));
  },
  toggleTrailMode: () => {
    const randomData = generateRandomArr(get().foodData, 10);
    const randomIds = randomData.map((a) => a.id);
    if (!get().trailMode) {
      set((state) => ({
        trailMode: !state.trailMode,
        trailIds: randomIds,
        heritageId: randomIds[0] !== undefined ? randomIds[0] : null,
      }));
    } else {
      set((state) => ({ trailMode: !state.trailMode, trailIds: [] }));
      get().unSelect();
    }
  },
  getFilteredTrails: () => {
    const filteredData = get().getFilteredFood();
    const filteredTrails = filteredData.filter((x) => get().trailIds.includes(x.id));
    const [cx, , cz] = findCentroid(
      filteredTrails.map((x) => geoConverter(x.location.geoLocation)),
    );

    filteredTrails.sort((a, b) => {
      const [ax, , az] = geoConverter(a.location.geoLocation);
      const [bx, , bz] = geoConverter(b.location.geoLocation);

      const angleA = Math.atan2(az + cz, ax + cx);
      const angleB = Math.atan2(bz + cz, bx + cx);

      return angleA - angleB;
    });
    return filteredTrails.map((x) => x.id);
  },
  moveToNextTrail: (reverse?: boolean) => {
    const filteredTrails = get().getFilteredTrails();
    const m = filteredTrails.length;
    if (m === 0) return -1;

    const currSelected = get().heritageId;
    if (currSelected === null || !filteredTrails.includes(currSelected)) {
      set({ heritageId: filteredTrails[0] });
      return 0;
    }
    const index = filteredTrails.indexOf(currSelected);
    let nextIndex = (index + 1) % m;
    if (reverse) {
      nextIndex = (index - 1 + m) % m;
    }
    set({ heritageId: filteredTrails[nextIndex] });
    return nextIndex;
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
}));
