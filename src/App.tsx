
import { useCallback, useState } from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import './App.css';
import ActionButtons from './components/ActionButtons';
import ArrowPad from './components/ArrowPad';
import BatteryStatus from './components/BatteryStatus';
import Joystick from './components/Joystick';
import SettingsModal from './components/SettingsModal';
import VideoFeed from './components/VideoFeed';
import WiFiStatus from './components/WiFiStatus';
import { applySpeedLimit, deadzone } from './utils';
import { useAppWebSocket } from './hooks/useAppWebSocket';
import { useAppStore } from './store';

const videoStream = (() => {
  if (!import.meta.env.VITE_STREAM_URL) {
    return location.origin + ':81/stream';
  }
  return import.meta.env.VITE_STREAM_URL;
})();

const normalizeWebSocketUrl = (value?: string) => {
  if (!value) {
    return location.origin.replace(/^http/, 'ws') + '/ws';
  }

  const rawValue = value.trim();

  if (/^wss?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue.replace(/^http/i, 'ws');
  }

  if (rawValue.startsWith('/')) {
    return `${location.origin.replace(/^http/, 'ws')}${rawValue}`;
  }

  if (rawValue.startsWith('//')) {
    return `${location.protocol === 'https:' ? 'wss:' : 'ws:'}${rawValue}`;
  }

  return `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${rawValue}`;
};

const wsUrl = normalizeWebSocketUrl(import.meta.env.VITE_WS_URL);

function App() {
  const {
    toggleFlashlight,
    toggleArm,
    drive,
    authenticateWifi
  } = useAppWebSocket(wsUrl + '?token=valid');

  // Selectors from state slices
  const appearance = useAppStore((state) => state.appearance);
  const roverSettingsSpeedLimit = useAppStore((state) => state.roverSettings.speedLimit);
  const flashlightOn = useAppStore((state) => state.flashlightOn);
  const isArmed = useAppStore((state) => state.isArmed);
  const batteryStatus = useAppStore((state) => state.batteryStatus);
  const wifiSignal = useAppStore((state) => state.wifiSignal);
  const networkStatus = useAppStore((state) => state.networkStatus);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleJoystickMove = useCallback((steering: number, throttle: number) => {
    // const speedLimit = Math.max(0, Math.min(100, roverSettings.speedLimit));
    let adjustedThrottle = deadzone(throttle);
    let adjustedSteering = deadzone(steering);
    adjustedThrottle = applySpeedLimit(adjustedThrottle, roverSettingsSpeedLimit);
    adjustedSteering = applySpeedLimit(adjustedSteering, roverSettingsSpeedLimit);
    console.log('Joystick move:', adjustedSteering, adjustedThrottle);
    drive({
      throttle: adjustedThrottle,
      steering: adjustedSteering
    });
  }, [roverSettingsSpeedLimit, drive]);

  const handleJoystickRelease = () => {
    drive({
      throttle: 0,
      steering: 0
    });
  };

  const handleConnectWiFi = useCallback((ssid: string, password: string) => {
    authenticateWifi({ ssid, password });
  }, [authenticateWifi]);

  const renderControlPad = () => {
    if (appearance.controlType === 'arrow_pad') {
      return <ArrowPad onMove={handleJoystickMove} onRelease={handleJoystickRelease} position={appearance.controlPosition} theme={appearance.theme} />;
    }

    return <Joystick onMove={handleJoystickMove} onRelease={handleJoystickRelease} position={appearance.controlPosition} theme={appearance.theme} />;
  };

  return (
    <div className={`wrapper relative flex h-screen w-screen ${appearance.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className="osd relative flex h-full w-full flex-1 flex-col items-center justify-center">
        {appearance.showVideoStream ? <VideoFeed src={videoStream} />: <h2>Video stream is disabled</h2>}

        {appearance.showBatteryStatus && <BatteryStatus voltage={batteryStatus.voltage} current={batteryStatus.current} charge={batteryStatus.charge} />}
        {appearance.showSignalQuality && <WiFiStatus isConnected={networkStatus.wifi_connected} internetAvailable={networkStatus.internet_available} rssi={wifiSignal.rssi} />}

        {renderControlPad()}

        <ActionButtons
          flashlightOn={flashlightOn}
          armed={isArmed}
          flashlightPosition={appearance.flashlightPosition}
          onToggleFlashlight={toggleFlashlight}
          onToggleArmed={toggleArm}
        />

        <div className="settings absolute left-5 top-5">
          <button type="button" className="settings__button" onClick={() => setSettingsOpen(true)}>
            <CogIcon className="size-12" />
          </button>
        </div>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConnectWifi={handleConnectWiFi}
      />
    </div>
  );
}

export default App;
