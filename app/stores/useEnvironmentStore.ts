// stores/useEnvironmentStore.ts
import { create } from 'zustand';
import { EnvironmentState, calculateEnvironment } from '@/app/utils/calcEnvironment';

interface EnvStore extends EnvironmentState {
  updateEnvironment: () => void;
}

export const useEnvironmentStore = create<EnvStore>((set) => ({
  ...calculateEnvironment(),

  updateEnvironment: () => set(() => calculateEnvironment()),
}));

// Start interval-based updating (1 min)
if (typeof window !== 'undefined') {
  setInterval(() => {
    useEnvironmentStore.getState().updateEnvironment();
  }, 60_000); // every 60 seconds
}
