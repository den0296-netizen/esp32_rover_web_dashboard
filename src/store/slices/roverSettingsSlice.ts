import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { RoverSettingsState } from '../../types/roverSettings';

export interface RoverSettingsSlice {
  roverSettings: RoverSettingsState;
  setRoverSettings: (settings: Partial<RoverSettingsState>) => void;
  resetRoverSettings: () => void;
}

export const defaultRoverSettingsState: RoverSettingsState = {
  speedLimit: 10, // Default speed limit percentage (or max value)
};

export const createRoverSettingsSlice: StateCreator<
  RootState,
  [],
  [],
  RoverSettingsSlice
> = (set) => ({
  roverSettings: defaultRoverSettingsState,

  setRoverSettings: (settings) =>
    set((state) => ({
      roverSettings: { ...state.roverSettings, ...settings },
    })),

  resetRoverSettings: () =>
    set({
      roverSettings: defaultRoverSettingsState,
    }),
});