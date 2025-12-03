import { create } from 'zustand';
import { EateryCategory, ThemeColor } from '../types';
import { ClassValue } from 'clsx';
import { ThemeRecord } from '../constants/theme';
import { data } from '../constants/data';

type State = {
  heritageId: string | null;
  filter: EateryCategory[];
  clickedMore: boolean;
};

type Actions = {
  setHeritageId: (newId: string) => void;
  setFilter: (cat: EateryCategory) => void;
  unsetFilter: (cat: EateryCategory) => void;
  getThemeStyle: () => ClassValue;
  openMore: () => void;
  closeMore: () => void;
  unSelect: () => void;
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
  filter: ['hawker', 'dessert', 'restaurant'],
  clickedMore: false,
  setHeritageId: (newId: string) => set({ heritageId: newId }),
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
  getThemeStyle: () => {
    const heritageId = get().heritageId;
    let theme: ThemeColor = 'primary';
    if (heritageId) {
      const heritage = data.find((v) => v.id === heritageId);
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
}));
