/* eslint-disable no-unused-vars */
import { create } from "zustand";

type State = {
  heritageId: string | null;
  clickedMore: boolean;
};

type Actions = {
  setHeritageId: (newId: string) => void;
  openMore: () => void;
  unSelect: () => void;
};

export const useHeritageStore = create<State & Actions>((set) => ({
  heritageId: null,
  clickedMore: false,
  openMore: () => set({ clickedMore: true }),
  setHeritageId: (newId: string) => set({ heritageId: newId }),
  unSelect: () => set({ heritageId: null }),
}));
