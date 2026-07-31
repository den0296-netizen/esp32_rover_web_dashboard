
import { useEffect, useState } from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import './App.css';
import ActionButtons from './components/ActionButtons';
import ArrowPad from './components/ArrowPad';
import BatteryStatus from './components/BatteryStatus';
import Joystick from './components/Joystick';
import SettingsModal from './components/SettingsModal';
import VideoFeed from './components/VideoFeed';
import WiFiStatus from './components/WiFiStatus';
import { defaultSettings, type AppSettings } from './types/settings';
import { deadzone } from './utils';
import { useAppWebSocket } from './hooks/useAppWebSocket';
import { useAppStore } from './store';

const STORAGE_KEY = 'rover-settings';

const videoStream = import.meta.env.VITE_STREAM_URL;
const websocketUrl = import.meta.env.VITE_WS_URL + '?token=valid';
function App() {
  const {
    toggleFlashlight,
    toggleArm,
    drive
  } = useAppWebSocket(websocketUrl);

  // Selectors from state slices
  const flashlightOn = useAppStore((state) => state.flashlightOn);
  const isArmed = useAppStore((state) => state.isArmed);
  const batteryStatus = useAppStore((state) => state.batteryStatus);
  const wifiSignal = useAppStore((state) => state.wifiSignal);

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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleJoystickMove = (steering: number, throttle: number) => {
    const speedLimit = Math.max(0, Math.min(100, settings.speedLimit));
    const adjustedThrottle = deadzone(Math.max(-speedLimit, Math.min(speedLimit, throttle)));
    const adjustedSteering = deadzone(Math.max(-speedLimit, Math.min(speedLimit, steering)));

    console.log('Joystick move:', adjustedSteering, adjustedThrottle);
    drive({
      throttle: adjustedThrottle,
      steering: adjustedSteering
    });
  };

  const handleJoystickRelease = () => {
    drive({
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

  return (
    <div className={`wrapper relative flex h-screen w-screen ${settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className="osd relative flex h-full w-full flex-1 flex-col items-center justify-center">
        {settings.showVideoStream ? <VideoFeed src={videoStream} />: <h2>Video stream is disabled</h2>}

        {settings.showBatteryStatus && <BatteryStatus voltage={batteryStatus.voltage} current={batteryStatus.current} remaining={batteryStatus.charge} />}
        {settings.showSignalQuality && <WiFiStatus rssi={wifiSignal.rssi} />}

        {renderControlPad()}

        <ActionButtons
          flashlightOn={flashlightOn}
          armed={isArmed}
          flashlightPosition={settings.flashlightPosition}
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
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default App;
