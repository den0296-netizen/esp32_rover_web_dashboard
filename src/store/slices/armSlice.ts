import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { ArmResult } from '../../types/websocket';

export interface ArmSlice {
  isArmed: boolean;
  handleArmToggleResponse: (payload: ArmResult) => void;
}

export const createArmSlice: StateCreator<RootState, [], [], ArmSlice> = (set) => ({
  isArmed: false,

  handleArmToggleResponse: (payload) => set({
    isArmed: payload.armed,
  }),
});