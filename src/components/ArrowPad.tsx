import { useEffect } from "react";

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

  const sendDirection = (steering: number, throttle: number) => {
    onMove?.(steering, throttle);
  };

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      switch(e.key) {
        case KEYBOARD_ARROWS[0]:
          sendDirection(0, 100)
          break;
        case KEYBOARD_ARROWS[1]:
          sendDirection(0, -100)
          break;
        case KEYBOARD_ARROWS[2]:
          sendDirection(-100, 0)
          break;
        case KEYBOARD_ARROWS[3]:
          sendDirection(100, 0)
          break;
      }
    };
    const keyupHandler = (e: KeyboardEvent) => {
      if (KEYBOARD_ARROWS.includes(e.key)) {
        sendDirection(0, 0);
      }
    };
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    return () => {
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
          onPointerDown={() => sendDirection(0, 100)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
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
          onPointerDown={() => sendDirection(-100, 0)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition active:scale-95 ${buttonClasses}`}
          onPointerDown={() => sendDirection(0, -100)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          aria-label="Move backward"
        >
          ↓
        </button>
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition active:scale-95 ${buttonClasses}`}
          onPointerDown={() => sendDirection(100, 0)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default ArrowPad;
