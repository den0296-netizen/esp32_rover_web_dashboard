import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

type JoystickProps = {
  onMove?: (steering: number, throttle: number) => void;
  onRelease?: () => void;
  position?: 'left' | 'right';
  theme?: 'dark' | 'light';
};

function Joystick({ onMove, onRelease, position = 'right', theme = 'dark' }: JoystickProps) {
  const joystickZoneRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<ReturnType<typeof nipplejs.create> | null>(null);
  const onMoveRef = useRef(onMove);
  const onReleaseRef = useRef(onRelease);

  useEffect(() => {
    onMoveRef.current = onMove;
    onReleaseRef.current = onRelease;
  }, [onMove, onRelease]);

  useEffect(() => {
    if (!joystickZoneRef.current) {
      return;
    }

    managerRef.current?.destroy();
    managerRef.current = null;

    const manager = nipplejs.create({
      zone: joystickZoneRef.current,
      mode: 'static',
      color: theme === 'dark' ? '#ffffffb6' : '#0000ff78',
      size: 150,
      position: {
        right: position === 'right' ? '120px' : undefined,
        left: position === 'left' ? '120px' : undefined,
        bottom: '120px'
      }
    });

    managerRef.current = manager;

    manager.on('move', (evt) => {
      const { vector } = evt.data;
      if (!vector) {
        return;
      }

      const steering = Math.round(vector.x * 100);
      const throttle = Math.round(vector.y * 100);

      onMoveRef.current?.(steering, throttle);
    });

    manager.on('end', () => {
      onReleaseRef.current?.();
    });

    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [position, theme]);

  return (
    <div className="joystick absolute top-0 left-0 bottom-0 right-0" ref={joystickZoneRef} />
  );
}

export default Joystick;
