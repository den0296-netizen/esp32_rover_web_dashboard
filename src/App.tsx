
import { useState } from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import './App.css';
import ActionButtons from './components/ActionButtons';
import BatteryStatus from './components/BatteryStatus';
import Joystick from './components/Joystick';
import SettingsModal from './components/SettingsModal';
import VideoFeed from './components/VideoFeed';
import WiFiStatus from './components/WiFiStatus';
import { deadzone } from './utils';

function App() {
  const [videoStream] = useState<string | undefined>(undefined);
  const [batteryVoltage] = useState(0);
  const [batteryCurrent] = useState(0);
  const [batteryRemaining] = useState(0);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [armed, setArmed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleJoystickMove = (steering: number, throttle: number) => {
    const adjustedThrottle = deadzone(Math.max(-100, Math.min(100, throttle)));
    const adjustedSteering = deadzone(Math.max(-100, Math.min(100, steering)));

    console.log('Joystick move:', adjustedSteering, adjustedThrottle);
  };

  const handleJoystickRelease = () => {
    console.log('Joystick released');
  };

  return (
    <div className="wrapper relative flex w-screen h-screen">
      <div className="osd relative flex-1 w-full h-full flex flex-col justify-center items-center">
        <VideoFeed src={videoStream} />

        <BatteryStatus voltage={batteryVoltage} current={batteryCurrent} remaining={batteryRemaining} />
        <WiFiStatus signalQuality={100} />

        <Joystick onMove={handleJoystickMove} onRelease={handleJoystickRelease} />

        <ActionButtons
          flashlightOn={flashlightOn}
          armed={armed}
          onToggleFlashlight={() => setFlashlightOn((value) => !value)}
          onToggleArmed={() => setArmed((value) => !value)}
        />

        <div className="settings absolute top-5 left-5">
          <button type="button" className="settings__button" onClick={() => setSettingsOpen(true)}>
            <CogIcon className="size-12" />
          </button>
        </div>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;
