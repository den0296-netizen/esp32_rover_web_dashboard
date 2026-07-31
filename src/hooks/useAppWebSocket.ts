import useWebSocket, { ReadyState } from 'react-use-websocket';
// import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
// import { ReadyState } from 'react-use-websocket/dist/lib/constants';
import { useAppStore } from '../store';
import type { ClientAction, DrivePayload, ServerEvent, WifiAuthPayload } from '../types/websocket';

export function useAppWebSocket(socketUrl: string) {
  // Pull handler functions from Zustand
  const handleWifiAuthResponse = useAppStore((state) => state.handleWifiAuthResponse);
  const handleFlashlightResponse = useAppStore((state) => state.handleFlashlightResponse);
  const handleArmToggleResponse = useAppStore((state) => state.handleArmToggleResponse);
  const handleBatteryStatusUpdate = useAppStore((state) => state.handleBatteryStatusUpdate);
  const handleWifiSignalUpdate = useAppStore((state) => state.handleWifiSignalUpdate);
  const handleNetworkStatusUpdate = useAppStore((state) => state.handleNetworkStatusUpdate);
  const handleNetworkInfoUpdate = useAppStore((state) => state.handleNetworkInfoUpdate);
  const handleTelemetryUpdate = useAppStore((state) => state.handleTelemetryUpdate);
  const setAuthenticatingWifi = useAppStore((state) => state.setAuthenticatingWifi);
  const setDriveState = useAppStore((state) => state.setDriveState);

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      try {
        const data: ServerEvent = JSON.parse(event.data);

        switch (data.event) {
          case 'wifi_authentication':
            handleWifiAuthResponse(data.payload);
            break;

          case 'toggle_flashlight':
            handleFlashlightResponse(data.payload);
            break;

          case 'arm_toggle':
            handleArmToggleResponse(data.payload);
            break;

          case 'battery_status':
            handleBatteryStatusUpdate(data.payload);
            break;

          case 'wifi_signal':
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

  // Action helpers to send structured JSON actions
  const sendAction = (actionData: ClientAction) => sendJsonMessage(actionData);

  const authenticateWifi = (payload: WifiAuthPayload) => {
    setAuthenticatingWifi(true);
    sendAction({ action: 'wifi_authenticate', payload });
  };

  const toggleFlashlight = () => {
    sendAction({ action: 'toggle_flashlight' });
  };

  const toggleArm = () => {
    sendAction({ action: 'arm_toggle' });
  };

  const drive = (payload: DrivePayload) => {
    setDriveState(payload);
    sendAction({ action: 'drive', payload });
  };

  return {
    isConnected: readyState === ReadyState.OPEN,
    readyState,
    authenticateWifi,
    toggleFlashlight,
    toggleArm,
    drive,
  };
}