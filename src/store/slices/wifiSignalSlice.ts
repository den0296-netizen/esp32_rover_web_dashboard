import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { WifiSignalPayload } from '../../types/websocket';

export interface WifiSignalSlice {
  wifiSignal: WifiSignalPayload;
  handleWifiSignalUpdate: (payload: WifiSignalPayload) => void;
}

export const createWifiSignalSlice: StateCreator<RootState, [], [], WifiSignalSlice> = (set) => ({
  wifiSignal: {
    rssi: -127
  },

  handleWifiSignalUpdate: (payload) => set({
    wifiSignal: payload,
  }),
});