import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { WifiAuthResult, WifiLogoutResult } from '../../types/websocket';

export interface WifiSlice {
  wifiAuthResult: WifiAuthResult | null;
  wifiLogoutResult: WifiLogoutResult | null;
  isAuthenticatingWifi: boolean;
  isLoggingOutWifi: boolean;
  setAuthenticatingWifi: (isAuthenticating: boolean) => void;
  setLoggingoutWifi: (isLoggingOut: boolean) => void;
  handleWifiAuthResponse: (payload: WifiAuthResult) => void;
  handleWifiLogoutResponse: (payload: WifiLogoutResult) => void;
}

export const createWifiSlice: StateCreator<RootState, [], [], WifiSlice> = (set) => ({
  wifiAuthResult: null,
  wifiLogoutResult: null,
  isAuthenticatingWifi: false,
  isLoggingOutWifi: false,
  setAuthenticatingWifi: (isAuthenticating) => set({ 
    isAuthenticatingWifi: isAuthenticating,
    ...(isAuthenticating && { wifiAuthResult: null }) 
  }),
  setLoggingoutWifi: (isLoggingOut) => set({ 
    isLoggingOutWifi: isLoggingOut,
    ...(isLoggingOut && { wifiLogoutResult: null }) 
  }),
  handleWifiAuthResponse: (payload) => set({
    wifiAuthResult: payload,
    isAuthenticatingWifi: false,
  }),
  handleWifiLogoutResponse: (payload) => set({
    wifiLogoutResult: payload,
    isLoggingOutWifi: false,
  }),
});