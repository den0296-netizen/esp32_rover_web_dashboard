type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6">
      <div
        className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/95 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:max-h-[calc(100vh-3rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sky-400">Preferences</p>
            <h2 id="settings-title" className="text-xl font-semibold text-slate-100">
              Settings
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-slate-200">
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Wi-Fi credentials
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="WiFiName" className="mb-1 block text-sm font-medium text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  id="WiFiName"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div>
                <label htmlFor="WiFiPassword" className="mb-1 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  id="WiFiPassword"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <label htmlFor="SpeedLimit" className="mb-1 block text-sm font-medium text-slate-300">
              Speed limit
            </label>
            <input
              type="number"
              name="SpeedLimit"
              id="SpeedLimit"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <span className="mb-3 block text-sm font-medium text-slate-300">Joystick position</span>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/60">
                <input type="radio" name="joystickPosition" value="left" className="h-4 w-4 border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500" defaultChecked />
                <span>Left</span>
              </label>
              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/60">
                <input type="radio" name="joystickPosition" value="right" className="h-4 w-4 border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                <span>Right</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
