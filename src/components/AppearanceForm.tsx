import type { AppearanceState, ControlType } from "../types/appearance";

interface AppearanceFormProps {
  panelClasses: string;
  inputClasses: string;
  mutedTextClasses: string;
  secondaryTextClasses: string;
  buttonHoverClasses: string;
  isDarkTheme: boolean;
  appearance: AppearanceState;
  setAppearance: (settings: Partial<AppearanceState>) => void;
  resetAppearance: () => void;
}

function AppearanceForm({
    panelClasses,
    inputClasses,
    mutedTextClasses,
    secondaryTextClasses,
    buttonHoverClasses,
    isDarkTheme,
    appearance,
    setAppearance,
    resetAppearance
}: AppearanceFormProps) {

  return <>
        <div className={`rounded-xl border p-4 ${panelClasses}`}>
        <h3 className={`mb-3 text-sm font-semibold uppercase tracking-[0.24em] ${mutedTextClasses}`}>
            Controls
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
            <div>
            <label className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>Control type</label>
            <select
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${inputClasses}`}
                value={appearance.controlType}
                onChange={(event) => setAppearance({ controlType: event.target.value as ControlType })}
            >
                <option value="joystick">Joystick</option>
                <option value="arrow_pad">Arrow Pad</option>
            </select>
            </div>
            <div>
            <label className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>Control position</label>
            <div className="flex gap-3">
                <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
                <input
                    type="radio"
                    name="controlPosition"
                    value="left"
                    checked={appearance.controlPosition === 'left'}
                    onChange={() => setAppearance({ controlPosition: 'left' })}
                />
                <span>Left</span>
                </label>
                <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
                <input
                    type="radio"
                    name="controlPosition"
                    value="right"
                    checked={appearance.controlPosition === 'right'}
                    onChange={() => setAppearance({ controlPosition: 'right' })}
                />
                <span>Right</span>
                </label>
            </div>
            </div>
            <div>
            <label className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>Flashlight position</label>
            <div className="flex gap-3">
                <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
                <input
                    type="radio"
                    name="flashlightPosition"
                    value="left"
                    checked={appearance.flashlightPosition === 'left'}
                    onChange={() => setAppearance({ flashlightPosition: 'left' })}
                />
                <span>Left</span>
                </label>
                <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
                <input
                    type="radio"
                    name="flashlightPosition"
                    value="right"
                    checked={appearance.flashlightPosition === 'right'}
                    onChange={() => setAppearance({ flashlightPosition: 'right' })}
                />
                <span>Right</span>
                </label>
            </div>
            </div>
            <div>
            <label className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>Theme</label>
            <div className="flex gap-3">
                <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
                <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={appearance.theme === 'dark'}
                    onChange={() => setAppearance({ theme: 'dark' })}
                />
                <span>Dark</span>
                </label>
                <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
                <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={appearance.theme === 'light'}
                    onChange={() => setAppearance({ theme: 'light' })}
                />
                <span>Light</span>
                </label>
            </div>
            </div>
        </div>
        </div>

        <div className={`rounded-xl border p-4 ${panelClasses}`}>
        <h3 className={`mb-3 text-sm font-semibold uppercase tracking-[0.24em] ${mutedTextClasses}`}>
            Visibility
        </h3>
        <div className="space-y-3">
            <label className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
            <span>Show battery status</span>
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                checked={appearance.showBatteryStatus}
                onChange={() => setAppearance({ showBatteryStatus: !appearance.showBatteryStatus })}
            />
            </label>
            <label className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
            <span>Show signal quality</span>
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                checked={appearance.showSignalQuality}
                onChange={() => setAppearance({ showSignalQuality: !appearance.showSignalQuality })}
            />
            </label>
            <label className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${panelClasses}`}>
            <span>Show video stream</span>
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                checked={appearance.showVideoStream}
                onChange={() => setAppearance({ showVideoStream: !appearance.showVideoStream })}
            />
            </label>
        </div>
        </div>
        <div>
        <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${buttonHoverClasses} bg-sky-500 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}
            onClick={resetAppearance}
        >
            Reset to defaults
        </button>
        </div>
    </>;
}

export default AppearanceForm;