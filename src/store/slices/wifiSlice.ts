import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { WifiAuthPayload, WifiAuthResult } from '../../types/websocket';

export interface WifiSlice {
  wifiAuthResult: WifiAuthResult | null;
  isAuthenticatingWifi: boolean;
  setAuthenticatingWifi: (isAuthenticating: boolean) => void;
  handleWifiAuthResponse: (payload: WifiAuthResult) => void;
}

export const createWifiSlice: StateCreator<RootState, [], [], WifiSlice> = (set) => ({
  wifiAuthResult: null,
  isAuthenticatingWifi: false,

  setAuthenticatingWifi: (isAuthenticating) => set({ 
    isAuthenticatingWifi: isAuthenticating,
    ...(isAuthenticating && { wifiAuthResult: null }) 
  }),

  handleWifiAuthResponse: (payload) => set({
    wifiAuthResult: payload,
    isAuthenticatingWifi: false,
  }),
});