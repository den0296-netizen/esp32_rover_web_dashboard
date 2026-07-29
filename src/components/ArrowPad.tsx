type ArrowPadProps = {
  onMove?: (steering: number, throttle: number) => void;
  onRelease?: () => void;
  position?: 'left' | 'right';
};

function ArrowPad({ onMove, onRelease, position = 'right' }: ArrowPadProps) {
  const sendDirection = (steering: number, throttle: number) => {
    onMove?.(steering, throttle);
  };

  return (
    <div className={`absolute bottom-8 ${position === 'left' ? 'left-8' : 'right-8'} flex flex-col items-center gap-2 rounded-3xl border border-slate-700/70 bg-slate-900/70 p-3 shadow-lg backdrop-blur-sm`}>
      <div className="flex gap-2">
        <div className="h-12 w-12" />
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-100 transition hover:bg-slate-700 active:scale-95"
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
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-100 transition hover:bg-slate-700 active:scale-95"
          onPointerDown={() => sendDirection(-100, 0)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-100 transition hover:bg-slate-700 active:scale-95"
          onPointerDown={() => sendDirection(0, -100)}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          aria-label="Move backward"
        >
          ↓
        </button>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-100 transition hover:bg-slate-700 active:scale-95"
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
