export interface RoverTelemetry {
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

export type RoverTelemetryPayload = RoverTelemetry;
