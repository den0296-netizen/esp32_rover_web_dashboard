import { useState } from "react";
import type { WifiAuthResult } from "../types/websocket";

interface WiFiFormProps {
    panelClasses: string;
    inputClasses: string;
    secondaryTextClasses: string;
    buttonHoverClasses: string;
    isDarkTheme: boolean;
    onConnect: (ssid: string, password: string) => void;
    ssid: string;
    connected: boolean;
    connecting: boolean;
    connectResult: WifiAuthResult | null;
}

function WiFiForm({
    panelClasses,
    inputClasses,
    secondaryTextClasses,
    buttonHoverClasses,
    isDarkTheme,
    onConnect,
    ssid,
    connected,
    connecting,
    connectResult
}: WiFiFormProps) {
    const [ssidValue, setSsidValue] = useState(ssid);
    const [password, setPassword] = useState('');
    const handleConnect = () => {
      onConnect(ssidValue, password);
    }

    return (
        <>
         <div className={`rounded-xl border p-4 ${panelClasses}`}>
              <div className="space-y-4">
                {(connected && ssid) && (
                  <div className={`text-sm font-medium ${isDarkTheme ? 'text-green-500' : 'text-green-700'}`}>
                    Connected to Wi-Fi network: <span className="font-semibold">{ssid}</span>
                  </div>
                )}
                <div>
                  <label htmlFor="WiFiName" className={`mb-1 block text-sm font-medium ${secondaryTextClasses}`}>
                    Wi-Fi Name (SSID)
                  </label>
                  <input
                    type="text"
                    id="WiFiName"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${inputClasses}`}
                    value={ssidValue}
                    disabled={connecting}
                    onChange={(e) => setSsidValue(e.target.value)}
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
                    value={password}
                    disabled={connecting}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                    <button
                        type="button"
                        className={`rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 ${buttonHoverClasses} ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}
                        disabled={connecting}
                        onClick={handleConnect}
                    >
                        Connect
                    </button>
                    {connecting && <p className="mt-2 text-sm text-sky-500">Connecting...</p>}
                    {connectResult && (
                        <p className={`mt-2 text-sm ${connectResult.success ? 'text-green-500' : 'text-red-500'}`}>
                            {connectResult.message}
                        </p>
                    )}
                </div>
              </div>
            </div>
        </>
    );
}

export default WiFiForm;