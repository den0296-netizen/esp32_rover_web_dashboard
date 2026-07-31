import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { BatteryStatusPayload } from '../../types/websocket';

export interface BatterySlice {
  batteryStatus: BatteryStatusPayload;
  handleBatteryStatusUpdate: (payload: BatteryStatusPayload) => void;
}

export const createBatterySlice: StateCreator<RootState, [], [], BatterySlice> = (set) => ({
  batteryStatus: {
    current: 0,
    voltage: 0,
    charge: 0,
    charging: false
  },

  handleBatteryStatusUpdate: (payload) => set({
    batteryStatus: payload,
  }),
});