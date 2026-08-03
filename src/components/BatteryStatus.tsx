import { Battery0Icon, Battery50Icon, Battery100Icon } from '@heroicons/react/24/solid';

type BatteryStatusProps = {
  voltage: number;
  current: number;
  charge: number;
};

function ChargeIcon({ charge }: { charge: number }) {
  if (charge >= 80) {
    return <Battery100Icon className="w-6 h-6" />;
  }
  if (charge >= 20) {
    return <Battery50Icon className="w-6 h-6" />;
  }
  return <Battery0Icon className="w-6 h-6" />;
}

function BatteryStatus({ voltage, current, charge }: BatteryStatusProps) {
  return (
    <div className="battery-status absolute bottom-5 left-5">
      <div className="battery-status__voltage">Voltage: {voltage?.toFixed(2)} V</div>
      <div className="battery-status__current">Current: {current?.toFixed(2)} A</div>
      <div className="battery-status__remaining flex flex-row align-center gap-1 justify-center items-center">
        <span> Charge: </span>
        <ChargeIcon charge={charge} />
        <span>{charge?.toFixed(2)} %</span>
      </div>
    </div>
  );
}

export default BatteryStatus;
