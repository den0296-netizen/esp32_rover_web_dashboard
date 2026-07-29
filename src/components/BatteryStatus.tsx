type BatteryStatusProps = {
  voltage: number;
  current: number;
  remaining: number;
};

function BatteryStatus({ voltage, current, remaining }: BatteryStatusProps) {
  return (
    <div className="battery-status absolute bottom-5 left-5">
      <div className="battery-status__voltage">Voltage: {voltage} V</div>
      <div className="battery-status__current">Current: {current} A</div>
      <div className="battery-status__remaining">Battery: {remaining} %</div>
    </div>
  );
}

export default BatteryStatus;
