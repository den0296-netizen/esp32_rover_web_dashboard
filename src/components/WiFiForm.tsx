
interface WiFiFormProps {
    panelClasses: string;
    inputClasses: string;
    secondaryTextClasses: string;
    buttonHoverClasses: string;
    isDarkTheme: boolean;
}

function WiFiForm({
    panelClasses,
    inputClasses,
    secondaryTextClasses,
    buttonHoverClasses,
    isDarkTheme
}: WiFiFormProps) {

    return (
        <>
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
        </>
    );
}

export default WiFiForm;