import {
  SignalIcon,
  LinkIcon,
  LinkSlashIcon,
} from '@heroicons/react/24/solid';
type WiFiStatusProps = {
  rssi: number;
  isConnected: boolean;
  internetAvailable: boolean;
};

// Helper to map RSSI values (dBm) to human-readable quality
  const getSignalQuality = (rssi: number) => {
    if (rssi >= -50) return 'Excellent';
    if (rssi >= -60) return 'Good';
    if (rssi >= -70) return 'Fair';
    return 'Weak';
  };

function WiFiStatus({ isConnected, internetAvailable, rssi }: WiFiStatusProps) {
  const linkQuality = getSignalQuality(rssi);
  return (
    <div className="wi-fi-status absolute top-5 right-5">
      <div className="wi-fi-status__internet flex flex-row align-center gap-1 justify-left items-center">
        <span>Internet access: {internetAvailable ? 'Available' : 'Unavailable'}</span>
        {internetAvailable ? <LinkIcon className="w-5 h-5" /> : <LinkSlashIcon className="w-5 h-5" />}
      </div>
      <div className="wi-fi-status__connection flex flex-row align-center gap-1 justify-left items-center">
        <span>Wi-Fi status: {isConnected ? 'Connected': 'Disconnected'} </span>
        {isConnected ? <LinkIcon className="w-5 h-5" /> : <LinkSlashIcon className="w-5 h-5" />}
      </div>
      {
        true ?
        <>
          <div className="wi-fi-status__signal-quality flex flex-row align-center gap-1 justify-left items-center">
            <span>Wi-Fi RSSI: {rssi}dBm</span>
            <SignalIcon className="w-5 h-5" />
          </div>
          <div className="wi-fi-status__signal-quality">Wi-Fi link quality: {linkQuality}</div>
        </>
        :
        null
      }
      
    </div>
  );
}

export default WiFiStatus;
