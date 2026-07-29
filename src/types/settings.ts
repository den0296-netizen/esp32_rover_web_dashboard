export type ControlType = 'joystick' | 'arrows';
export type ControlPosition = 'left' | 'right';
export type FlashlightPosition = 'left' | 'right';
export type ThemeMode = 'dark' | 'light';

export interface AppSettings {
  controlType: ControlType;
  controlPosition: ControlPosition;
  flashlightPosition: FlashlightPosition;
  theme: ThemeMode;
  showBatteryStatus: boolean;
  showSignalQuality: boolean;
  showVideoStream: boolean;
  speedLimit: number;
}

export const defaultSettings: AppSettings = {
  controlType: 'joystick',
  controlPosition: 'right',
  flashlightPosition: 'left',
  theme: 'dark',
  showBatteryStatus: true,
  showSignalQuality: true,
  showVideoStream: true,
  speedLimit: 50,
};
