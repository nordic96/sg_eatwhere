import { create } from 'zustand';

type State = {
  localeOpen: boolean;
  closeLocale: () => void;
  openLocale: () => void;
};

export const useAppStore = create<State>((set) => ({
  localeOpen: false,
  closeLocale: () => set(() => ({ localeOpen: false })),
  openLocale: () => set(() => ({ localeOpen: true })),
}));
