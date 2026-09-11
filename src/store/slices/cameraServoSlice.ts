import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { CameraServoPayload } from '../../types/websocket';

export interface CameraServoSlice {
  cameraServoState: CameraServoPayload;
  setCameraServoState: (payload: CameraServoPayload) => void;
}

export const createCameraServoSlice: StateCreator<RootState, [], [], CameraServoSlice> = (set) => ({
  cameraServoState: {
    pwm: 1500,
  },

  setCameraServoState: (payload) => set({
    cameraServoState: payload,
  }),
});