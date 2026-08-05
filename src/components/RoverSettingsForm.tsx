import type { RoverSettingsState } from "../types/roverSettings";

interface RoverSettingsFormProps {
  roverSettings: RoverSettingsState;
  setRoverSettings: (settings: Partial<RoverSettingsState>) => void;
  resetRoverSettings: () => void;
  panelClasses: string;
  secondaryTextClasses: string;
  inputClasses: string;
  buttonHoverClasses: string;
  isDarkTheme: boolean;
}

function RoverSettingsForm({ roverSettings, setRoverSettings, resetRoverSettings, panelClasses, secondaryTextClasses, inputClasses, buttonHoverClasses, isDarkTheme }: RoverSettingsFormProps) {
    
    return (
        <>
            <div className={`rounded-xl border p-4 ${panelClasses}`}>
                <label htmlFor="SpeedLimit" className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>
                  Speed limit
                </label>
                <input
                  type="number"
                  name="SpeedLimit"
                  id="SpeedLimit"
                  min={10}
                  max={100}
                  value={roverSettings.speedLimit}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    setRoverSettings({ speedLimit: Number.isFinite(nextValue) ? nextValue : 0 });
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${inputClasses}`}
                />
              </div>
              <div>
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${buttonHoverClasses} bg-sky-500 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}
                  onClick={resetRoverSettings}
                >
                  Reset to defaults
                </button>
              </div>
        </>
    );
}

export default RoverSettingsForm;