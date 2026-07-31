interface TelemetryEventPayload {
    roll: number;
    pitch: number;
    yaw: number;
    battery_voltage: number;
    battery_remaining: number | null;
    battery_current: number;
    armed: boolean;
    flash_on: boolean;
    speed_limit: number;
    wifi_rssi: number;
}

interface ControlPayload {
    throttle: number;
    steering: number;
}

interface WiFiAuthenticatePayload {
    ssid: string;
    password: string;
}

interface WebSocketGeneralMessage {
    version: number;
    seq: number;
    payload?: any;
}

interface WebSocketActionMessage extends WebSocketGeneralMessage {
    action: string;
}

interface WebSocketEventMessage extends WebSocketGeneralMessage {
    event: string;
}

interface WebSocketWifiAuthenticateActionMessage extends WebSocketActionMessage {
    action: 'wifi_authenticate';
    payload: WiFiAuthenticatePayload;
}

interface WebSocketControlActionMessage extends WebSocketActionMessage {
    action: 'control';
    payload: ControlPayload;
}

interface WebSocketTelemetryEventMessage extends WebSocketEventMessage {
    event: 'telemetry';
    payload: TelemetryEventPayload;
}

export type WebSocketActionMessageType = WebSocketWifiAuthenticateActionMessage |
WebSocketControlActionMessage;

export type WebSocketEventMessageType = WebSocketTelemetryEventMessage;
