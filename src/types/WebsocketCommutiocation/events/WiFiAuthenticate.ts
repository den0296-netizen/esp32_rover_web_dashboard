import type { WebSocketEventMessage } from "..";

interface WiFiAuthenticateEventPayload {
    success: boolean;
    message: string;
}

export interface WebSocketWiFiAuthenticateEventMessage extends WebSocketEventMessage {
    event: 'wifi_authenticate';
    payload: WiFiAuthenticateEventPayload;
}