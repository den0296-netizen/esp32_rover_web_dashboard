export type ThemeMode = 'light' | 'dark';
export type ControlPosition = 'right' | 'left';
export type ControlType = 'joystick' | 'arrow_pad';
export type FlashlightPosition = 'left' | 'right';
export type CameraPositionPlacement = 'left' | 'right';

export interface AppearanceState {
  theme: ThemeMode;
  controlPosition: ControlPosition;
  controlType: ControlType;
  flashlightPosition: FlashlightPosition;
  cameraPosition: number;
  cameraPositionPlacement: CameraPositionPlacement;
  showBatteryStatus: boolean;
  showSignalQuality: boolean;
  showVideoStream: boolean;
}