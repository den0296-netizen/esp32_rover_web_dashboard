import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { NetworkInfoPayload } from '../../types/websocket';

export interface NetworkInfoSlice {
  networkInfo: NetworkInfoPayload | null;
  handleNetworkInfoUpdate: (payload: NetworkInfoPayload) => void;
}

export const createNetworkInfoSlice: StateCreator<
  RootState,
  [],
  [],
  NetworkInfoSlice
> = (set) => ({
  networkInfo: {
    wifi_ssid: '',
    ap_ip: '',
    lan_ip: '',
    wan_ip: ''
  },

  handleNetworkInfoUpdate: (payload) =>
    set({
      networkInfo: payload,
    }),
});