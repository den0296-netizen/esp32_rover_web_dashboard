import { useState } from 'react';
import { Tabs } from './Tabs';
import { useAppStore } from '../store';
import type { ControlType } from '../types/appearance';
import AppearanceForm from './AppearanceForm';
import RoverSettingsForm from './RoverSettingsForm';
import WiFiForm from './WiFiForm';

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
        <Tabs defaultValue={tabs[0].key}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
          className={isDarkTheme ? 'border-slate-800' : 'border-slate-200'}>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.key}
              value={tab.key}
              tabInactiveClasses={tabInactiveClasses}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs>

        <div className={`flex-1 space-y-4 overflow-y-auto px-6 py-5 ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
          {activeTab === 'appearance' && (
            <AppearanceForm
              panelClasses={panelClasses}
              inputClasses={inputClasses}
              mutedTextClasses={mutedTextClasses}
              secondaryTextClasses={secondaryTextClasses}
              buttonHoverClasses={buttonHoverClasses}
              isDarkTheme={isDarkTheme}
              appearance={appearance}
              setAppearance={setAppearance}
              resetAppearance={resetAppearance}
            />
          )}

          {activeTab === 'rover' && (
            <div>
              <RoverSettingsForm
                panelClasses={panelClasses}
                inputClasses={inputClasses}
                secondaryTextClasses={secondaryTextClasses}
                buttonHoverClasses={buttonHoverClasses}
                isDarkTheme={isDarkTheme}
                roverSettings={roverSettings}
                setRoverSettings={setRoverSettings}
                resetRoverSettings={resetRoverSettings}
              />
            </div>
          )}

          {activeTab === 'network' && (
            <WiFiForm 
              panelClasses={panelClasses}
              inputClasses={inputClasses}
              secondaryTextClasses={secondaryTextClasses}
              buttonHoverClasses={buttonHoverClasses}
              isDarkTheme={isDarkTheme}
            />
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
