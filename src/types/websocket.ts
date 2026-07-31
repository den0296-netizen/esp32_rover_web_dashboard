// --- Base Protocol Header ---
export interface WsMessageHeader {
  version: number;
  seq: number;
}

// --- Payload Types ---
export interface WifiAuthPayload {
  ssid: string;
  password?: string;
}

export interface WifiAuthResult {
  success: boolean;
  message: string;
}

export interface FlashlightResult {
  flashlight_on: boolean;
}

export interface ArmResult {
  armed: boolean;
}

export interface BatteryStatusPayload {
  current: number;
  voltage: number;
  charge: number;
  charging: boolean;
}

export interface WifiSignalPayload {
  rssi: number;
}

export interface DrivePayload {
  throttle: number;
  steering: number;
}

export interface NetworkStatusPayload {
  wifi_connected: boolean;
  internet_available: boolean;
}

export interface NetworkInfoPayload {
  wifi_ssid: string;
  ap_ip: string;
  lan_ip: string;
  wan_ip: string;
}

export interface TelemetryData {
  battery_current: number;
  battery_voltage: number;
  battery_remaining: number;
  [key: string]: unknown;
}

// --- Outbound Actions (Client -> Server) ---
export type RawClientAction =
  | { action: 'wifi_authenticate'; payload: WifiAuthPayload }
  | { action: 'toggle_flashlight' }
  | { action: 'arm_toggle' }
  | { action: 'drive'; payload: DrivePayload };

// Complete outbound message with headers
export type ClientAction = WsMessageHeader & RawClientAction;

// Inbound events
export type ServerEvent = WsMessageHeader &
  (
    | { event: 'wifi_authentication'; payload: WifiAuthResult }
    | { event: 'toggle_flashlight'; payload: FlashlightResult }
    | { event: 'arm_toggle'; payload: ArmResult }
    | { event: 'battery_status'; payload: BatteryStatusPayload }
    | { event: 'wifi_signal'; payload: WifiSignalPayload }
    | { event: 'network_status'; payload: NetworkStatusPayload }
    | { event: 'network_info'; payload: NetworkInfoPayload }
    | { event: 'telemetry'; payload: TelemetryData }
  );