import type { CameraPositionPlacement, ThemeMode } from '../types/appearance';

type CameraPositionSliderProps = {
  value: number;
  placement: CameraPositionPlacement;
  theme: ThemeMode;
  onChange: (value: number) => void;
};

function CameraPositionSlider({ value, placement, theme, onChange }: CameraPositionSliderProps) {
  const isDarkTheme = theme === 'dark';

  return (
    <div
      className={`absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2 ${placement === 'left' ? 'left-5' : 'right-5'}`}
    >
      <label
        htmlFor="camera-position-slider"
        className={`text-[10px] font-semibold uppercase tracking-[0.18em] [writing-mode:vertical-rl] ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}
      >
        Camera
      </label>
      <input
        id="camera-position-slider"
        type="range"
        min="1000"
        max="1900"
        step="50"
        value={value}
        aria-label="Camera position"
        className={`h-56 w-2 cursor-pointer [writing-mode:vertical-lr] [direction:rtl] ${isDarkTheme ? 'accent-sky-400' : 'accent-sky-600'}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output
        htmlFor="camera-position-slider"
        className={`min-w-12 text-center text-xs font-semibold tabular-nums ${isDarkTheme ? 'text-slate-200' : 'text-slate-800'}`}
      >
        {value}
      </output>
    </div>
  );
}

export default CameraPositionSlider;