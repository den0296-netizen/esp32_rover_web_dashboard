import { useState } from 'react';
import { Tabs } from './Tabs';
import { useAppStore } from '../store';
import type { ControlType } from '../types/appearance';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TabKey = 'appearance' | 'rover' | 'network' | 'status' | 'about';

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('appearance');
  const appearance = useAppStore((state) => state.appearance);
  const setAppearance = useAppStore((state) => state.setAppearance);
  const resetAppearance = useAppStore((state) => state.resetAppearance);
  const roverSettings = useAppStore((state) => state.roverSettings);
  const setRoverSettings = useAppStore((state) => state.setRoverSettings);
  const resetRoverSettings = useAppStore((state) => state.resetRoverSettings);

  if (!isOpen) {
    return null;
  }

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'appearance', label: 'Appearance' },
    { key: 'rover', label: 'Rover' },
    { key: 'network', label: 'Network' },
    { key: 'status', label: 'Status' },
    { key: 'about', label: 'About' },
  ];

  const isDarkTheme = appearance.theme === 'dark';
  const shellClasses = isDarkTheme
    ? 'border-slate-700/70 bg-slate-900/95 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
    : 'border-slate-300/80 bg-slate-50/95 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.16)]';
  const panelClasses = isDarkTheme
    ? 'border-slate-800 bg-slate-800/50 text-slate-200'
    : 'border-slate-200 bg-slate-100/80 text-slate-700';
  const inputClasses = isDarkTheme
    ? 'border-slate-700 bg-slate-950/70 text-slate-100 focus:border-sky-500 focus:ring-sky-500/20'
    : 'border-slate-300 bg-white text-slate-900 focus:border-sky-500 focus:ring-sky-500/20';
  const mutedTextClasses = isDarkTheme ? 'text-slate-400' : 'text-slate-500';
  const secondaryTextClasses = isDarkTheme ? 'text-slate-300' : 'text-slate-700';
  const tabInactiveClasses = isDarkTheme
    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900';
  const footerBorderClasses = isDarkTheme ? 'border-slate-800' : 'border-slate-200';
  const buttonHoverClasses = isDarkTheme ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-200 hover:text-slate-900';

  return (
    <div className={`fixed inset-0 z-1000 flex items-center justify-center ${isDarkTheme ? 'bg-slate-950/70' : 'bg-slate-900/40'} px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6`}>
      <div
        className={`flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:max-h-[calc(100vh-3rem)] ${shellClasses}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className={`flex shrink-0 items-center justify-between border-b px-6 py-4 ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <p className={`text-[11px] font-medium uppercase tracking-[0.28em] ${isDarkTheme ? 'text-sky-400' : 'text-sky-600'}`}>Preferences</p>
            <h2 id="settings-title" className={`text-xl font-semibold ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>
              Settings
            </h2>
          </div>
          <button
            type="button"
            className={`rounded-full p-2 transition ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={`flex shrink-0 flex-wrap gap-2 border-b px-4 py-3 ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-sky-500 text-slate-950'
                  : tabInactiveClasses
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={`flex-1 space-y-4 overflow-y-auto px-6 py-5 ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
          {activeTab === 'appearance' && (
            <>
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
            </>
          )}

          {activeTab === 'rover' && (
            <div>
              <div className={`rounded-xl border p-4 ${panelClasses}`}>
                <label htmlFor="SpeedLimit" className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>
                  Speed limit
                </label>
                <input
                  type="number"
                  name="SpeedLimit"
                  id="SpeedLimit"
                  min={0}
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
            </div>
          )}

          {activeTab === 'network' && (
            <div className={`rounded-xl border p-4 ${panelClasses}`}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="WiFiName" className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>
                    Wi-Fi Name (SSID)
                  </label>
                  <input
                    type="text"
                    id="WiFiName"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${inputClasses}`}
                  />
                </div>
                <div>
                  <label htmlFor="WiFiPassword" className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>
                    Wi-Fi Password
                  </label>
                  <input
                    type="password"
                    id="WiFiPassword"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${inputClasses}`}
                  />
                </div>
                <div>
                    <button
                        type="button"
                        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                    >
                        Connect
                    </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className={`rounded-xl border p-4 text-sm ${panelClasses}`}>
              <p className={`mb-2 font-medium ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>System status</p>
              <p className={`leading-6 ${mutedTextClasses}`}>No status information available yet. This section will be populated with telemetry, connection health, and rover diagnostics in a future update.</p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className={`rounded-xl border p-4 text-sm leading-7 ${panelClasses}`}>
              <p>
                This rover dashboard provides a compact control surface for monitoring and operating a remote rover from a web browser. The interface is designed to keep core telemetry visible while giving quick access to controls such as the flashlight, arm state, and joystick input. The settings panel lets you personalize the experience to match your preferred layout and visibility needs, whether you are using it in a lab, on the field, or while testing from a mobile device.
              </p>
              <p className="mt-3">
                The design focuses on clarity, responsiveness, and a modern touch-friendly experience. Every section is built to stay usable on smaller screens, with scrollable content that helps preserve the full range of configuration options without sacrificing readability.
              </p>
            </div>
          )}
        </div>

        <div className={`flex shrink-0 justify-end gap-3 border-t px-6 py-4 ${footerBorderClasses}`}>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${buttonHoverClasses} ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
