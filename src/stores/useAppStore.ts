import { create } from 'zustand';

type State = {
  localeOpen: boolean;
  clickedMore: boolean;
};

type Actions = {
  openMore: () => void;
  closeMore: () => void;
  closeLocale: () => void;
  openLocale: () => void;
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

export const useAppStore = create<State & Actions>((set) => ({
  localeOpen: false,
  clickedMore: false,
  closeLocale: () => set(() => ({ localeOpen: false })),
  openLocale: () => set(() => ({ localeOpen: true })),
  openMore: () => {
    set({ clickedMore: true });
    openSidebar();
  },
  closeMore: () => {
    set({ clickedMore: false });
    closeSidebar();
  },
}));
