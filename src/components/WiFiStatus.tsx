type WiFiStatusProps = {
  rssi: number;
};

function wifi_quality(rssi: number)
{
    if (rssi <= -100)
        return 0;

    if (rssi >= -50)
        return 100;

    return 2 * (rssi + 100);
}

function WiFiStatus({ rssi }: WiFiStatusProps) {
  const linkQuality = wifi_quality(rssi);
  return (
    <div className="wi-fi-status absolute top-5 right-5">
      <div className="wi-fi-status__signal-quality">Wi-Fi RSSI: {rssi}dBm</div>
      <div className="wi-fi-status__signal-quality">Wi-Fi quality: {linkQuality}%</div>
    </div>
  );
}

export default WiFiStatus;
