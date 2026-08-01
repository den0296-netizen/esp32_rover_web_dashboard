import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { AppearanceState } from '../../types/appearance';

export interface AppearanceSlice {
  appearance: AppearanceState;
  setAppearance: (settings: Partial<AppearanceState>) => void;
  resetAppearance: () => void;
}

export const defaultAppearanceState: AppearanceState = {
  theme: 'light',
  controlPosition: 'right',
  controlType: 'joystick',
  flashlightPosition: 'left',
  showBatteryStatus: true,
  showSignalQuality: true,
  showVideoStream: true,
};

export const createAppearanceSlice: StateCreator<
  RootState,
  [],
  [],
  AppearanceSlice
> = (set) => ({
  appearance: defaultAppearanceState,

  setAppearance: (settings) =>
    set((state) => ({
      appearance: { ...state.appearance, ...settings },
    })),

  resetAppearance: () =>
    set({
      appearance: defaultAppearanceState,
    }),
});