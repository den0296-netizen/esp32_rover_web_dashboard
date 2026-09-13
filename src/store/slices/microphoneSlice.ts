import type { StateCreator } from 'zustand';
import type { RootState } from '../index';
import type { MicrophoneMuteResult } from '../../types/websocket';

export interface MicrophoneSlice {
  microphoneMuted: boolean;
  handleMicrophoneMuteResponse: (payload: MicrophoneMuteResult) => void;
}

export const createMicrophoneSlice: StateCreator<RootState, [], [], MicrophoneSlice> = (set) => ({
  microphoneMuted: true,

  handleMicrophoneMuteResponse: (payload) => set({
    microphoneMuted: payload.microphone_muted,
  }),
});