type WiFiStatusProps = {
  signalQuality: number;
};

function WiFiStatus({ signalQuality }: WiFiStatusProps) {
  return (
    <div className="wi-fi-status absolute top-5 right-5">
      <div className="wi-fi-status__signal-quality">Wi-Fi quality: {signalQuality}</div>
    </div>
  );
}

export default WiFiStatus;
