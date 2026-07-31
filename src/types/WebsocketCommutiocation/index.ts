export interface WebSocketGeneralMessage {
    version: number;
    seq: number;
    payload?: any;
}

export interface WebSocketActionMessage extends WebSocketGeneralMessage {
    action: string;
}

export interface WebSocketEventMessage extends WebSocketGeneralMessage {
    event: string;
}

