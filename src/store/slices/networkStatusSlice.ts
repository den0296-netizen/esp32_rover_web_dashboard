import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { NetworkStatusPayload } from '../../types/websocket';

export interface NetworkStatusSlice {
  networkStatus: NetworkStatusPayload | null;
  handleNetworkStatusUpdate: (payload: NetworkStatusPayload) => void;
}

export const createNetworkStatusSlice: StateCreator<
  RootState,
  [],
  [],
  NetworkStatusSlice
> = (set) => ({
  networkStatus: {
    wifi_connected: false,
    internet_available: false
  },

  handleNetworkStatusUpdate: (payload) =>
    set({
      networkStatus: payload,
    }),
});