import { useEffect, useRef } from "react";

type ArrowPadProps = {
  onMove?: (steering: number, throttle: number) => void;
  onRelease?: () => void;
  position?: 'left' | 'right';
  theme?: 'dark' | 'light';
};

const KEYBOARD_ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function ArrowPad({ onMove, onRelease, position = 'right', theme = 'dark' }: ArrowPadProps) {
  const isDarkTheme = theme === 'dark';
  const containerClasses = isDarkTheme
    ? 'border-slate-200 bg-slate-50/90 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.12)]'
    : 'border-slate-700/70 bg-slate-900/70 text-slate-100 shadow-[0_12px_30px_rgba(0,0,0,0.35)]';
  const buttonClasses = isDarkTheme
    ? 'border-slate-300 bg-white text-slate-900 hover:bg-slate-200'
    : 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700';

  const emitTimerRef = useRef<number | null>(null);
  const latestDirectionRef = useRef({ steering: 0, throttle: 0 });
  const activeKeysRef = useRef(new Set<string>());

  const clearEmitTimer = () => {
    if (emitTimerRef.current !== null) {
      window.clearInterval(emitTimerRef.current);
      emitTimerRef.current = null;
    }
  };

  const emitLatestDirection = () => {
    onMove?.(latestDirectionRef.current.steering, latestDirectionRef.current.throttle);
  };

  const startEmission = (steering: number, throttle: number) => {
    latestDirectionRef.current = { steering, throttle };
    emitLatestDirection();

    if (emitTimerRef.current === null) {
      emitTimerRef.current = window.setInterval(emitLatestDirection, 50);
    }
  };

  const stopEmission = () => {
    clearEmitTimer();
    latestDirectionRef.current = { steering: 0, throttle: 0 };
    onRelease?.();
  };

  useEffect(() => {
    const updateKeyboardDirection = () => {
      const activeKeys = activeKeysRef.current;
      let steering = 0;
      let throttle = 0;

      if (activeKeys.has(KEYBOARD_ARROWS[2])) {
        steering = -100;
      } else if (activeKeys.has(KEYBOARD_ARROWS[3])) {
        steering = 100;
      }

      if (activeKeys.has(KEYBOARD_ARROWS[0])) {
        throttle = 100;
      } else if (activeKeys.has(KEYBOARD_ARROWS[1])) {
        throttle = -100;
      }

      if (activeKeys.size === 0) {
        stopEmission();
        return;
      }

      startEmission(steering, throttle);
    };

    const keydownHandler = (e: KeyboardEvent) => {
      if (!KEYBOARD_ARROWS.includes(e.key)) {
        return;
      }

      e.preventDefault();

      if (!activeKeysRef.current.has(e.key)) {
        activeKeysRef.current.add(e.key);
        updateKeyboardDirection();
      }
    };

    const keyupHandler = (e: KeyboardEvent) => {
      if (!KEYBOARD_ARROWS.includes(e.key)) {
        return;
      }

      e.preventDefault();
      activeKeysRef.current.delete(e.key);
      updateKeyboardDirection();
    };

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    return () => {
      clearEmitTimer();
      activeKeysRef.current.clear();
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    };
  }, []);

  return (
    <div className={`absolute bottom-8 ${position === 'left' ? 'left-8' : 'right-8'} flex flex-col items-center gap-2 rounded-3xl border p-3 shadow-lg backdrop-blur-sm ${containerClasses}`}>
      <div className="flex gap-2">
        <div className="h-12 w-12" />
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition active:scale-95 ${buttonClasses}`}
          onPointerDown={() => startEmission(0, 100)}
          onPointerUp={stopEmission}
          onPointerLeave={stopEmission}
          onPointerCancel={stopEmission}
          aria-label="Move forward"
        >
          ↑
        </button>
        <div className="h-12 w-12" />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition active:scale-95 ${buttonClasses}`}
          onPointerDown={() => startEmission(-100, 0)}
          onPointerUp={stopEmission}
          onPointerLeave={stopEmission}
          onPointerCancel={stopEmission}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition active:scale-95 ${buttonClasses}`}
          onPointerDown={() => startEmission(0, -100)}
          onPointerUp={stopEmission}
          onPointerLeave={stopEmission}
          onPointerCancel={stopEmission}
          aria-label="Move backward"
        >
          ↓
        </button>
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition active:scale-95 ${buttonClasses}`}
          onPointerDown={() => startEmission(100, 0)}
          onPointerUp={stopEmission}
          onPointerLeave={stopEmission}
          onPointerCancel={stopEmission}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default ArrowPad;
