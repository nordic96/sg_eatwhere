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
  unSelect: () => void;
};

export const useHeritageStore = create<State & Actions>((set) => ({
  heritageId: null,
  filter: [],
  clickedMore: false,
  setHeritageId: (newId: string) => set({ heritageId: newId }),
  setFilter: (newFilter: EateryCategory) =>
    set((state) => ({ filter: state.filter.concat([newFilter]) })),
  unsetFilter: (filter: EateryCategory) =>
    set((state) => ({ filter: state.filter.filter((x) => x !== filter) })),
  openMore: () => set({ clickedMore: true }),
  unSelect: () => set({ heritageId: null }),
}));
