import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { type WifiSlice, createWifiSlice } from './slices/wifiSlice';
import { type FlashlightSlice, createFlashlightSlice } from './slices/flashlightSlice';
import { type TelemetrySlice, createTelemetrySlice } from './slices/telemetrySlice';
import { createArmSlice, type ArmSlice } from './slices/armSlice';
import { createBatterySlice, type BatterySlice } from './slices/batterySlice';
import { createWifiSignalSlice, type WifiSignalSlice } from './slices/wifiSignalSlice';
import { createDriveSlice, type DriveSlice } from './slices/driveSlice';
import { createNetworkStatusSlice, type NetworkStatusSlice } from './slices/networkStatusSlice';
import { createNetworkInfoSlice, type NetworkInfoSlice } from './slices/networkInfoSlice';
import { createAppearanceSlice, type AppearanceSlice } from './slices/appearanceSlice';
import { createRoverSettingsSlice, type RoverSettingsSlice } from './slices/roverSettingsSlice';

export type RootState = WifiSlice &
  FlashlightSlice &
  ArmSlice &
  BatterySlice &
  WifiSignalSlice &
  DriveSlice &
  NetworkStatusSlice &
  NetworkInfoSlice &
  AppearanceSlice &
  RoverSettingsSlice &
  TelemetrySlice;

export const useAppStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createWifiSlice(...a),
      ...createFlashlightSlice(...a),
      ...createArmSlice(...a),
      ...createBatterySlice(...a),
      ...createWifiSignalSlice(...a),
      ...createDriveSlice(...a),
      ...createNetworkStatusSlice(...a),
      ...createNetworkInfoSlice(...a),
      ...createAppearanceSlice(...a),
      ...createRoverSettingsSlice(...a),
      ...createTelemetrySlice(...a),
    }),
    {
      name: 'app-local-settings', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Persist ONLY the appearance state to localStorage
      partialize: (state) => ({
        appearance: state.appearance,
        roverSettings: state.roverSettings,
      }),
    }
  )
);