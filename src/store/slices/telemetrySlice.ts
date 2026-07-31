import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { TelemetryData } from '../../types/websocket';

export interface TelemetrySlice {
  telemetry: TelemetryData;
  handleTelemetryUpdate: (payload: TelemetryData) => void;
}

export const createTelemetrySlice: StateCreator<RootState, [], [], TelemetrySlice> = (set) => ({
  telemetry: {
    battery_current: 0,
    battery_remaining: 0,
    battery_voltage: 0
  },

  handleTelemetryUpdate: (payload) => set({
    telemetry: payload,
  }),
});