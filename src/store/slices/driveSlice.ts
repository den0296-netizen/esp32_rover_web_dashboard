import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { DrivePayload } from '../../types/websocket';

export interface DriveSlice {
  driveState: DrivePayload;
  setDriveState: (payload: DrivePayload) => void;
}

export const createDriveSlice: StateCreator<RootState, [], [], DriveSlice> = (set) => ({
  driveState: {
    throttle: 0,
    steering: 0,
  },

  setDriveState: (payload) => set({
    driveState: payload,
  }),
});