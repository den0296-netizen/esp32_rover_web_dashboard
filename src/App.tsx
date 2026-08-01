
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
import { deadzone } from './utils';
import { useAppWebSocket } from './hooks/useAppWebSocket';
import { useAppStore } from './store';

const videoStream = import.meta.env.VITE_STREAM_URL;
function App() {
  const {
    toggleFlashlight,
    toggleArm,
    drive
  } = useAppWebSocket(import.meta.env.VITE_WS_URL + '?token=valid');

  // Selectors from state slices
  const appearance = useAppStore((state) => state.appearance);
  const roverSettings = useAppStore((state) => state.roverSettings);
  const flashlightOn = useAppStore((state) => state.flashlightOn);
  const isArmed = useAppStore((state) => state.isArmed);
  const batteryStatus = useAppStore((state) => state.batteryStatus);
  const wifiSignal = useAppStore((state) => state.wifiSignal);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleJoystickMove =useCallback((steering: number, throttle: number) => {
    const speedLimit = Math.max(0, Math.min(100, roverSettings.speedLimit));
    const adjustedThrottle = deadzone(Math.max(-speedLimit, Math.min(speedLimit, throttle)));
    const adjustedSteering = deadzone(Math.max(-speedLimit, Math.min(speedLimit, steering)));

    console.log('Joystick move:', adjustedSteering, adjustedThrottle);
    drive({
      throttle: adjustedThrottle,
      steering: adjustedSteering
    });
  }, [roverSettings.speedLimit]);

  const handleJoystickRelease = () => {
    drive({
      throttle: 0,
      steering: 0
    });
  };

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

        {appearance.showBatteryStatus && <BatteryStatus voltage={batteryStatus.voltage} current={batteryStatus.current} remaining={batteryStatus.charge} />}
        {appearance.showSignalQuality && <WiFiStatus rssi={wifiSignal.rssi} />}

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
      />
    </div>
  );
}

export default App;
