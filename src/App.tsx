
import { useEffect, useState } from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { ReadyState } from 'react-use-websocket/dist/lib/constants';
import './App.css';
import ActionButtons from './components/ActionButtons';
import ArrowPad from './components/ArrowPad';
import BatteryStatus from './components/BatteryStatus';
import Joystick from './components/Joystick';
import SettingsModal from './components/SettingsModal';
import VideoFeed from './components/VideoFeed';
import WiFiStatus from './components/WiFiStatus';
import { defaultSettings, type AppSettings } from './types/settings';
import { type RoverTelemetryPayload } from './types/telemetry';
import { deadzone } from './utils';

const STORAGE_KEY = 'rover-settings';
let control_seq = 0;

function App() {
  const videoStream = import.meta.env.VITE_STREAM_URL as string | undefined;
  const websocketUrl = import.meta.env.VITE_WS_URL + '?token=valid' as string | undefined;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') {
      return defaultSettings;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }

    try {
      return { ...defaultSettings, ...JSON.parse(stored) } as AppSettings;
    } catch {
      return defaultSettings;
    }
  });

  const { readyState, sendMessage, sendJsonMessage, lastJsonMessage } = useWebSocket<RoverTelemetryPayload>(websocketUrl ?? '', {
    shouldReconnect: () => true,
    reconnectAttempts: 5,
    reconnectInterval: 1000,
    share: true,
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && websocketUrl) {
      sendMessage(JSON.stringify({ type: 'status' }));
    }
  }, [readyState, sendMessage, websocketUrl]);

  const handleJoystickMove = (steering: number, throttle: number) => {
    const speedLimit = Math.max(0, Math.min(100, settings.speedLimit));
    const adjustedThrottle = deadzone(Math.max(-speedLimit, Math.min(speedLimit, throttle)));
    const adjustedSteering = deadzone(Math.max(-speedLimit, Math.min(speedLimit, steering)));

    console.log('Joystick move:', adjustedSteering, adjustedThrottle);
    sendJsonMessage({
        type: "control",
        seq: control_seq++,
        throttle: adjustedThrottle,
        steering: adjustedSteering
    });
  };

  const handleJoystickRelease = () => {
    sendJsonMessage({
        type: "control",
        seq: control_seq++,
        throttle: 0,
        steering: 0
    });
  };

  const handleSettingsChange = (nextSettings: AppSettings) => {
    const sanitizedSpeedLimit = Math.max(0, Math.min(100, Math.round(nextSettings.speedLimit)));
    setSettings({ ...nextSettings, speedLimit: sanitizedSpeedLimit });
  };

  const renderControlPad = () => {
    if (settings.controlType === 'arrows') {
      return <ArrowPad onMove={handleJoystickMove} onRelease={handleJoystickRelease} position={settings.controlPosition} theme={settings.theme} />;
    }

    return <Joystick onMove={handleJoystickMove} onRelease={handleJoystickRelease} position={settings.controlPosition} theme={settings.theme} />;
  };

  const handleToggleFlashlight = () => sendJsonMessage({ type: "flash_toggle" });
  const handleToggleArmed = () => sendJsonMessage({ type: "arm_toggle" });

  return (
    <div className={`wrapper relative flex h-screen w-screen ${settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className="osd relative flex h-full w-full flex-1 flex-col items-center justify-center">
        {settings.showVideoStream ? <VideoFeed src={videoStream} />: <h2>Video stream is disabled</h2>}

        {settings.showBatteryStatus && <BatteryStatus voltage={lastJsonMessage?.battery_voltage} current={lastJsonMessage?.battery_current} remaining={lastJsonMessage?.battery_remaining ?? 0} />}
        {settings.showSignalQuality && <WiFiStatus rssi={lastJsonMessage?.wifi_rssi} />}

        {renderControlPad()}

        <ActionButtons
          flashlightOn={lastJsonMessage?.flash_on}
          armed={lastJsonMessage?.armed}
          flashlightPosition={settings.flashlightPosition}
          onToggleFlashlight={handleToggleFlashlight}
          onToggleArmed={handleToggleArmed}
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
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default App;
