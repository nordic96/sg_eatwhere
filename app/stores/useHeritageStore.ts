/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { EateryCategory } from "../types";

type State = {
  heritageId: string | null;
  filter: EateryCategory | null;
  clickedMore: boolean;
};

type Actions = {
  setHeritageId: (newId: string) => void;
  setFilter: (cat: EateryCategory) => void;
  unsetFilter: () => void;
  openMore: () => void;
  unSelect: () => void;
};

export const useHeritageStore = create<State & Actions>((set) => ({
  heritageId: null,
  filter: null,
  clickedMore: false,
  setHeritageId: (newId: string) => set({ heritageId: newId }),
  setFilter: (newFilter: EateryCategory) => set({ filter: newFilter }),
  unsetFilter: () => set({ filter: null }),
  openMore: () => set({ clickedMore: true }),
  unSelect: () => set({ heritageId: null }),
}));
