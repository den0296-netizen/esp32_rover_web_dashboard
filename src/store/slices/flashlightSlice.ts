import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { FlashlightResult } from '../../types/websocket';

export interface FlashlightSlice {
  flashlightOn: boolean;
  handleFlashlightResponse: (payload: FlashlightResult) => void;
}

export const createFlashlightSlice: StateCreator<RootState, [], [], FlashlightSlice> = (set) => ({
  flashlightOn: false,

  handleFlashlightResponse: (payload) => set({
    flashlightOn: payload.flashlight_on,
  }),
});