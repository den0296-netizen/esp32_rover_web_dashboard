type WiFiStatusProps = {
  rssi: number;
};

// Helper to map RSSI values (dBm) to human-readable quality
  const getSignalQuality = (rssi: number) => {
    if (rssi >= -50) return 'Excellent 📶';
    if (rssi >= -60) return 'Good 📶';
    if (rssi >= -70) return 'Fair 📶';
    return 'Weak 📶';
  };

function WiFiStatus({ rssi }: WiFiStatusProps) {
  const linkQuality = getSignalQuality(rssi);
  return (
    <div className="wi-fi-status absolute top-5 right-5">
      <div className="wi-fi-status__signal-quality">Wi-Fi RSSI: {rssi}dBm</div>
      <div className="wi-fi-status__signal-quality">Wi-Fi quality: {linkQuality}</div>
    </div>
  );
}

export default WiFiStatus;
