import { create } from 'zustand';
import { type WifiSlice, createWifiSlice } from './slices/wifiSlice';
import { type FlashlightSlice, createFlashlightSlice } from './slices/flashlightSlice';
import { type TelemetrySlice, createTelemetrySlice } from './slices/telemetrySlice';
import { createArmSlice, type ArmSlice } from './slices/armSlice';
import { createBatterySlice, type BatterySlice } from './slices/batterySlice';
import { createWifiSignalSlice, type WifiSignalSlice } from './slices/wifiSignalSlice';
import { createDriveSlice, type DriveSlice } from './slices/driveSlice';
import { createNetworkStatusSlice, type NetworkStatusSlice } from './slices/networkStatusSlice';
import { createNetworkInfoSlice, type NetworkInfoSlice } from './slices/networkInfoSlice';

export type RootState = WifiSlice &
  FlashlightSlice &
  ArmSlice &
  BatterySlice &
  WifiSignalSlice &
  DriveSlice &
  NetworkStatusSlice &
  NetworkInfoSlice &
  TelemetrySlice;

export const useAppStore = create<RootState>()((...a) => ({
  ...createWifiSlice(...a),
  ...createFlashlightSlice(...a),
  ...createArmSlice(...a),
  ...createBatterySlice(...a),
  ...createWifiSignalSlice(...a),
  ...createDriveSlice(...a),
  ...createNetworkStatusSlice(...a),
  ...createNetworkInfoSlice(...a),
  ...createTelemetrySlice(...a),
}));