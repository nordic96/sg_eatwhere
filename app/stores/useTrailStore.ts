import { create } from 'zustand';
import { findCentroid, generateRandomArr, geoConverter } from '../utils';
import { useHeritageStore } from './useHeritageStore';

type State = {
  trailMode: boolean;
  trailIds: string[];
};

type Actions = {
  toggleTrailMode: () => void;
  moveToNextTrail: (reverse?: boolean) => number;
  getFilteredTrails: () => string[];
};

export const useTrailStore = create<State & Actions>((set, get) => ({
  trailMode: false,
  trailIds: [],
  toggleTrailMode: () => {
    const foodData = useHeritageStore.getState().foodData;
    const randomData = generateRandomArr(foodData, 10);
    const randomIds = randomData.map((a) => a.id);
    if (!get().trailMode) {
      set((state) => ({
        trailMode: !state.trailMode,
        trailIds: randomIds,
      }));
      useHeritageStore.getState().setHeritageId(randomIds[0] !== undefined ? randomIds[0] : null);
    } else {
      set((state) => ({ trailMode: !state.trailMode, trailIds: [] }));
      useHeritageStore.getState().unSelect();
    }
  },
  getFilteredTrails: () => {
    const filteredData = useHeritageStore.getState().getFilteredFood();
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

    const currSelected = useHeritageStore.getState().heritageId;
    if (currSelected === null || !filteredTrails.includes(currSelected)) {
      useHeritageStore.getState().setHeritageId(filteredTrails[0]);
      return 0;
    }
    const index = filteredTrails.indexOf(currSelected);
    let nextIndex = (index + 1) % m;
    if (reverse) {
      nextIndex = (index - 1 + m) % m;
    }
    useHeritageStore.getState().setHeritageId(filteredTrails[nextIndex]);
    return nextIndex;
  },
}));
