import type { WebSocketActionMessage } from "..";

interface WiFiAuthenticateActionPayload {
    ssid: string;
    password: string;
}

export interface WebSocketWifiAuthenticateActionMessage extends WebSocketActionMessage {
    action: 'wifi_authenticate';
    payload: WiFiAuthenticateActionPayload;
}