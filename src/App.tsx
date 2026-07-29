
import { useEffect, useRef, useState } from 'react'
import nipplejs from 'nipplejs'
import { BoltIcon, BoltSlashIcon, CogIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import './App.css'

function deadzone(value: number, limit = 8)
{
    return Math.abs(value) < limit ? 0 : value;
}

function App() {
  const [videoStream, setVideoStrem] = useState<string | undefined>(undefined);
  const [batteryVoltage, setBatteryVoltage] = useState(0);
  const [batteryCurrent, setBatteryCurrent] = useState(0);
  const [batteryRemaining, setBatteryRemaining] = useState(0);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [armed, setArmed] = useState(false);

  const joystickZoneRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<ReturnType<typeof nipplejs.create> | null>(null);

  useEffect(() => {
    if (!joystickZoneRef.current) return;

    // Initialize nipplejs
    const manager = nipplejs.create({
      zone: joystickZoneRef.current,
      mode: 'static',
      // position: { right: '7%', bottom: '15%' },
      color: '#0000ff78',
      size: 150
    });

    managerRef.current = manager;

    // Event listeners
    manager.on('move', (_evt) => {
      const { vector } = _evt.data;
      if (!vector)
        return;

      let steering = Math.round(vector.x * 100);
      let throttle = Math.round(vector.y * 100);
      

      throttle = Math.max(-100, Math.min(100, throttle));
      steering = Math.max(-100, Math.min(100, steering));

      throttle = deadzone(throttle);
      steering = deadzone(steering);
      console.log("Joystick move:", steering, throttle);
    });

    manager.on('end', () => {
      console.log('Joystick released');
    });

    // Cleanup on unmount
    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div className='wrapper relative flex w-screen h-screen'>
        <div className='osd relative flex-1 w-full h-full flex flex-col justify-center items-center'>
          <img className='video-stream' src={videoStream} style={{width: 600, height: 400, background: 'rgba(181, 35, 35, 1)'}} />

          <div className='battery-status absolute bottom-5 left-5'>
            <div className='battery-status__voltage'>Voltage: {batteryVoltage} V</div>
            <div className='battery-status__current'>Current: {batteryCurrent} A</div>
            <div className='battery-status__remaining'>Battery: {batteryRemaining} %</div>
          </div>

          <div className='wi-fi-status absolute top-5 right-5'>
            <div className='wi-fi-status__signal-quality'>Wi-Fi quality: 100</div>
          </div>

          <div className='joystick absolute bottom-30 right-30' ref={joystickZoneRef}>
            
          </div>

          <div className='flash-light-toggle absolute left-5'>
            <button className='flash-light-toggle__button' onClick={() => setFlashlightOn(!flashlightOn)}>
              {flashlightOn ? <BoltIcon className='size-12' /> : <BoltSlashIcon className='size-12' />}
            </button>
          </div>

          <div className='arm-toggle absolute bottom-5 left-center'>
            <button className='arm-toggle__button' onClick={() => setArmed(!armed)}>
              {armed ? <LockOpenIcon className='size-12' /> : <LockClosedIcon className='size-12' />}
            </button>
          </div>



          <div className='settings absolute top-5 left-5'>
            <button className='settings__button'>
              <CogIcon className='size-12' />
            </button>
          </div>

        </div>
        <div className='settings__modal absolute hidden'>
          <div className='settings__modal-dropshadow'></div>
          <div className='settings__modal-container'>
            <div className='settings__modal-header'>
              <button className='settins__modal-close-button'>close</button>
              <h2 className='settings__modal-title'>Settings</h2>
            </div>
            <div className='settings__modal-body'>
              <div>
                <h3>Wi-Fi Credentials</h3>
                <div>
                  <label htmlFor="WiFiName">Name</label>
                  <input type="text" id='WiFi Name' />
                </div>
                <div>
                  <label htmlFor="WiFiPassword">Password</label>
                  <input type="password" id='WiFi Password' />
                </div>

                <div>
                  <label htmlFor="SpeedLimit">Speed Limit</label>
                  <input type="number" name="SpeedLimit" id="SpeedLimit" />
                </div>

                <div>
                  <h3>Joystick postion (left/right)</h3>
                </div>


              </div>
            </div>
            <div className='settings__modal-footer'>
              <button className='settings__modal-cancel'>CANCEL</button>
              <button className='settings__modal-save'>SAVE</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
