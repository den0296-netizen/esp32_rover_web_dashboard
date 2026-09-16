// import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { ReadyState } from 'react-use-websocket/dist/lib/constants';
import { useAppStore } from '../store';
import type { CameraServoPayload, DrivePayload, RawClientAction, ServerEvent, WifiAuthPayload } from '../types/websocket';
import { useEffect, useRef } from 'react';

const CURRENT_API_VERSION = 1;
const AUDIO_SAMPLE_RATE = 16000;
const DEFAULT_PLAYBACK_GAIN = 1.2;

type AudioContextWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const decodeUlaw = (value: number) => {
  const invertedValue = (~value) & 0xff;
  const magnitude = ((invertedValue & 0x0f) << 3) + 0x84;
  const shiftedMagnitude = magnitude << ((invertedValue & 0x70) >> 4);
  const sample = invertedValue & 0x80
    ? 0x84 - shiftedMagnitude
    : shiftedMagnitude - 0x84;

  return sample / 32768;
};


export function useAppWebSocket(socketUrl: string) {
  // Local sequence counter reference across renders
  const seqRef = useRef<number>(1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextAudioStartTimeRef = useRef(0);
  const audioFrameCountRef = useRef(0);
  const audioLockWarningLoggedRef = useRef(false);
  const playbackGainRef = useRef(DEFAULT_PLAYBACK_GAIN);
  // Pull handler functions from Zustand
  const handleWifiAuthResponse = useAppStore((state) => state.handleWifiAuthResponse);
  const handleWifiLogoutResponse = useAppStore((state) => state.handleWifiLogoutResponse);
  const handleFlashlightResponse = useAppStore((state) => state.handleFlashlightResponse);
  const handleMicrophoneMuteResponse = useAppStore((state) => state.handleMicrophoneMuteResponse);
  const handleArmToggleResponse = useAppStore((state) => state.handleArmToggleResponse);
  const handleCameraServoUpdate = useAppStore((state) => state.handleCameraServoUpdate);
  const handleBatteryStatusUpdate = useAppStore((state) => state.handleBatteryStatusUpdate);
  const handleWifiSignalUpdate = useAppStore((state) => state.handleWifiSignalUpdate);
  const handleNetworkStatusUpdate = useAppStore((state) => state.handleNetworkStatusUpdate);
  const handleNetworkInfoUpdate = useAppStore((state) => state.handleNetworkInfoUpdate);
  const handleTelemetryUpdate = useAppStore((state) => state.handleTelemetryUpdate);
  const setAuthenticatingWifi = useAppStore((state) => state.setAuthenticatingWifi);
  const setLoggingoutWifi = useAppStore((state) => state.setLoggingoutWifi);
  const setDriveState = useAppStore((state) => state.setDriveState);
  const setCameraServoState = useAppStore((state) => state.setCameraServoState);

  const getAudioContext = () => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    const AudioContextConstructor = window.AudioContext
      ?? (window as AudioContextWindow).webkitAudioContext;

    if (!AudioContextConstructor) {
      console.warn('Web Audio API is not supported by this browser.');
      return null;
    }

    audioContextRef.current = new AudioContextConstructor({ sampleRate: AUDIO_SAMPLE_RATE });
    return audioContextRef.current;
  };

  const playAudioFrame = async (data: ArrayBuffer | Blob) => {
    const rawUlaw = data instanceof Blob
      ? new Uint8Array(await data.arrayBuffer())
      : new Uint8Array(data);

    if (rawUlaw.length === 0) {
      console.warn('Received an empty binary audio frame.');
      return;
    }

    const decodedSamples = new Float32Array(rawUlaw.length);
    const byteValues = new Set<number>();
    let peak = 0;
    let minimum = 1;
    let maximum = -1;
    let sumOfSquares = 0;

    for (let index = 0; index < rawUlaw.length; index += 1) {
      byteValues.add(rawUlaw[index]);
      const sample = decodeUlaw(rawUlaw[index]);
      decodedSamples[index] = sample;
      peak = Math.max(peak, Math.abs(sample));
      minimum = Math.min(minimum, sample);
      maximum = Math.max(maximum, sample);
      sumOfSquares += sample * sample;
    }

    audioFrameCountRef.current += 1;
    const frameDuration = rawUlaw.length / AUDIO_SAMPLE_RATE;
    const rms = Math.sqrt(sumOfSquares / rawUlaw.length);
    if (audioFrameCountRef.current === 1 || audioFrameCountRef.current % 100 === 0) {
      console.info('[Audio] μ-law frame valid:', {
        frame: audioFrameCountRef.current,
        bytes: rawUlaw.length,
        uniqueBytes: byteValues.size,
        firstBytes: Array.from(rawUlaw.slice(0, 16)).map((value) => value.toString(16).padStart(2, '0')).join(' '),
        durationMs: Math.round(frameDuration * 1000),
        minimum: minimum.toFixed(6),
        maximum: maximum.toFixed(6),
        peak: peak.toFixed(6),
        rms: rms.toFixed(6),
      });
    }

    const audioContext = audioContextRef.current;
    if (!audioContext) {
      if (!audioLockWarningLoggedRef.current) {
        console.warn('[Audio] Frame received, but audio is locked. Click the microphone button to enable playback.');
        audioLockWarningLoggedRef.current = true;
      }
      return;
    }

    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        console.warn('Audio playback is blocked. Click the microphone button to enable sound.', error);
        return;
      }
    }

    if (audioContext.state !== 'running') {
      console.warn(`AudioContext is not running: ${audioContext.state}`);
      return;
    }

    const audioBuffer = audioContext.createBuffer(1, rawUlaw.length, AUDIO_SAMPLE_RATE);
    const channel = audioBuffer.getChannelData(0);

    for (let index = 0; index < rawUlaw.length; index += 1) {
      const amplifiedSample = decodedSamples[index] * playbackGainRef.current;
      channel[index] = Math.max(-1, Math.min(1, amplifiedSample));
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    const now = audioContext.currentTime;
    const nextStartTime = Math.max(nextAudioStartTimeRef.current, now);
    source.start(nextStartTime);
    nextAudioStartTimeRef.current = nextStartTime + audioBuffer.duration;
  };

  const handleVideoFrame = (data: ArrayBuffer) => {
    useAppStore.getState().setVideoFrame(new Blob([data], { type: 'image/jpeg' }));
  };

  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    onOpen: () => {
      const socket = getWebSocket();
      if (socket instanceof WebSocket) {
        socket.binaryType = 'arraybuffer';
      }
    },
    onMessage: async (event) => {
      if (typeof event.data !== 'string') {
        const buffer = event.data instanceof Blob
          ? await event.data.arrayBuffer()
          : event.data;

        const bytes = new Uint8Array(buffer);

        if (bytes.length === 0) {
          return;
        }

        const frameType = bytes[0];
        const payload = buffer.slice(1);

        switch (frameType) {
          case 0x01:
            // μ-law audio
            void playAudioFrame(payload).catch((error: unknown) => {
              console.error('Failed to play binary audio frame:', error);
            });
            break;

          case 0x02:
            // JPEG video
            handleVideoFrame(payload);
            break;

          default:
            console.warn(
              `[WS] Unknown binary frame type: 0x${frameType.toString(16)}`
            );
        }

        return;
      }

      try {
        const data: ServerEvent = JSON.parse(event.data);

        // Optional log or check sequence number / API version
        console.debug(`[WS Received] seq: ${data.seq}, version: ${data.version}`);

        switch (data.event) {
          case 'ws_connected':
            console.info('WebSocket connected:', data.payload);
            handleNetworkInfoUpdate(data.payload);
            handleNetworkStatusUpdate(data.payload);
            handleWifiSignalUpdate(data.payload);
            if (data.payload.flashlight_on !== undefined) {
              handleFlashlightResponse({ flashlight_on: data.payload.flashlight_on });
            }
            if (data.payload.camera_servo !== undefined) {
              handleCameraServoUpdate(data.payload.camera_servo);
            }
            break;
          case 'wifi_authenticate':
            handleWifiAuthResponse(data.payload);
            break;
          
          case 'wifi_logout':
            handleWifiLogoutResponse(data.payload);
            break;

          case 'flashlight_toggle':
            handleFlashlightResponse(data.payload);
            break;

          case 'microphone_toggle_mute':
            handleMicrophoneMuteResponse(data.payload);
            break;

          case 'arm_toggle':
            handleArmToggleResponse(data.payload);
            break;

          case 'camera_servo':
            handleCameraServoUpdate(data.payload);
            break;

          case 'battery_status':
            handleBatteryStatusUpdate(data.payload);
            break;

          case 'wifi_rssi':
            handleWifiSignalUpdate(data.payload);
            break;

          case 'network_status':
            handleNetworkStatusUpdate(data.payload);
            break;
          
          case 'network_info':
            handleNetworkInfoUpdate(data.payload);
            break;

          case 'telemetry':
            handleTelemetryUpdate(data.payload);
            break;

          default:
            console.warn('Unhandled WebSocket event:', data);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    },
    shouldReconnect: () => true, // Automatically reconnect
  });

  useEffect(() => {
    const socket = getWebSocket();
    if (socket instanceof WebSocket) {
      socket.binaryType = 'arraybuffer';
    }
  }, [getWebSocket, readyState]);

  // Automatically injects version and auto-incrementing seq into outgoing actions
  const sendAction = (rawAction: RawClientAction, version = CURRENT_API_VERSION) => {
    const currentSeq = seqRef.current++;
    sendJsonMessage({
      version,
      seq: currentSeq,
      ...rawAction,
    });
  };

  const authenticateWifi = (payload: WifiAuthPayload) => {
    setAuthenticatingWifi(true);
    sendAction({ action: 'wifi_authenticate', payload });
  };

  const logoutWifi = () => {
    setLoggingoutWifi(true);
    sendAction({ action: 'wifi_logout' });
  };

  const toggleFlashlight = () => {
    sendAction({ action: 'flashlight_toggle' });
  };

  const toggleMicrophoneMute = () => {
    const audioContext = getAudioContext();
    if (audioContext?.state === 'suspended') {
      void audioContext.resume().catch((error: unknown) => {
        console.warn('Unable to resume audio playback:', error);
      });
    }
    sendAction({ action: 'microphone_toggle_mute' });
  };

  const setPlaybackGain = (gain: number) => {
    playbackGainRef.current = Math.max(1, Math.min(2, gain));
  };

  const toggleArm = () => {
    sendAction({ action: 'arm_toggle' });
  };

  const drive = (payload: DrivePayload) => {
    setDriveState(payload);
    sendAction({ action: 'drive', payload });
  };

  const cameraServo = (payload: CameraServoPayload) => {
    setCameraServoState(payload);
    sendAction({ action: 'camera_servo', payload });
  };

  return {
    isConnected: readyState === ReadyState.OPEN,
    readyState,
    authenticateWifi,
    logoutWifi,
    toggleFlashlight,
    toggleMicrophoneMute,
    setPlaybackGain,
    toggleArm,
    drive,
    cameraServo,
  };
}