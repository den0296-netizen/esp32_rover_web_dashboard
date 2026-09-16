import type { StateCreator } from 'zustand';
import type { RootState } from '../index';

export interface VideoSlice {
  videoFrame: Blob | null;
  setVideoFrame: (frame: Blob) => void;
}

export const createVideoSlice: StateCreator<RootState, [], [], VideoSlice> = (set) => ({
  videoFrame: null,

  setVideoFrame: (frame) => set({ videoFrame: frame }),
});