/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { EateryCategory } from "../types";

type State = {
  heritageId: string | null;
  filter: EateryCategory[];
  clickedMore: boolean;
};

type Actions = {
  setHeritageId: (newId: string) => void;
  setFilter: (cat: EateryCategory) => void;
  unsetFilter: (cat: EateryCategory) => void;
  openMore: () => void;
  closeMore: () => void;
  unSelect: () => void;
};

export function openSidebar() {
  const sidebar = document.getElementById("list-sidebar");
  sidebar?.classList.remove("translate-y-[-120%]", "opacity-0");
  sidebar?.classList.add("translate-y-0", "opacity-100");
}

export function closeSidebar() {
  const toggleButton = document.getElementById("list-sidebar");
  if (toggleButton !== null) {
    toggleButton.classList.remove("translate-y-0", "opacity-100");
    toggleButton.classList.add("translate-y-[-120%]", "optacity-0");
  }
}

export const useHeritageStore = create<State & Actions>((set) => ({
  heritageId: null,
  filter: ["hawker", "dessert", "restaurant"],
  clickedMore: false,
  setHeritageId: (newId: string) => set({ heritageId: newId }),
  setFilter: (newFilter: EateryCategory) =>
    set((state) => ({ filter: state.filter.concat([newFilter]) })),
  unsetFilter: (filter: EateryCategory) =>
    set((state) => ({ filter: state.filter.filter((x) => x !== filter) })),
  openMore: () => {
    set({ clickedMore: true });
    openSidebar();
  },
  closeMore: () => {
    set({ clickedMore: false });
    closeSidebar();
  },
  unSelect: () => set({ heritageId: null }),
}));
