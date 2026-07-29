
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

const STORAGE_KEY = 'rover-settings';

function App() {
  const [videoStream] = useState<string | undefined>(undefined);
  const [batteryVoltage] = useState(0);
  const [batteryCurrent] = useState(0);
  const [batteryRemaining] = useState(0);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [armed, setArmed] = useState(false);
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
    const adjustedThrottle = deadzone(Math.max(-100, Math.min(100, throttle)));
    const adjustedSteering = deadzone(Math.max(-100, Math.min(100, steering)));

    console.log('Joystick move:', adjustedSteering, adjustedThrottle);
  };

  const handleJoystickRelease = () => {
    console.log('Joystick released');
  };

  const handleSettingsChange = (nextSettings: AppSettings) => {
    setSettings(nextSettings);
  };

  const renderControlPad = () => {
    if (settings.controlType === 'arrows') {
      return <ArrowPad onMove={handleJoystickMove} onRelease={handleJoystickRelease} />;
    }

    return <Joystick onMove={handleJoystickMove} onRelease={handleJoystickRelease} />;
  };

  return (
    <div className={`wrapper relative flex h-screen w-screen ${settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className="osd relative flex h-full w-full flex-1 flex-col items-center justify-center">
        <VideoFeed src={videoStream} />

        {settings.showBatteryStatus && <BatteryStatus voltage={batteryVoltage} current={batteryCurrent} remaining={batteryRemaining} />}
        {settings.showSignalQuality && <WiFiStatus signalQuality={100} />}

        {renderControlPad()}

        <ActionButtons
          flashlightOn={flashlightOn}
          armed={armed}
          onToggleFlashlight={() => setFlashlightOn((value) => !value)}
          onToggleArmed={() => setArmed((value) => !value)}
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
