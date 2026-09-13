import { BoltIcon, BoltSlashIcon, LockClosedIcon, LockOpenIcon, MicrophoneIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

type ActionButtonsProps = {
  flashlightOn: boolean;
  microphoneMuted: boolean;
  armed: boolean;
  flashlightPosition: 'left' | 'right';
  onToggleFlashlight: () => void;
  onToggleMicrophoneMute: () => void;
  onPlaybackGainChange: (gain: number) => void;
  onToggleArmed: () => void;
};

function ActionButtons({
  flashlightOn,
  microphoneMuted,
  armed,
  flashlightPosition,
  onToggleFlashlight,
  onToggleMicrophoneMute,
  onPlaybackGainChange,
  onToggleArmed,
}: ActionButtonsProps) {
  const [volumeSliderOpen, setVolumeSliderOpen] = useState(false);
  const [playbackGain, setPlaybackGain] = useState(1.2);

  const handlePlaybackGainChange = (value: number) => {
    const clampedGain = Math.max(1, Math.min(2, value));
    setPlaybackGain(clampedGain);
    onPlaybackGainChange(clampedGain);
  };

  return (
    <>
      <div className={`flash-light-toggle absolute ${flashlightPosition === 'left' ? 'left-5' : 'right-5'}`}>
        <button type="button" className="action-button flash-light-toggle__button" onClick={onToggleFlashlight} aria-label="Toggle flashlight">
          {flashlightOn ? <BoltIcon className="size-12" /> : <BoltSlashIcon className="size-12" />}
        </button>
      </div>

      <div className={`microphone-toggle absolute top-24 ${flashlightPosition === 'left' ? 'left-5' : 'right-5'}`}>
        <button
          type="button"
          className="action-button microphone-toggle__button"
          onClick={onToggleMicrophoneMute}
          aria-label="Toggle microphone mute"
          aria-pressed={microphoneMuted}
        >
          <span className="relative block size-12">
            <MicrophoneIcon className="size-12" />
            {microphoneMuted && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-red-500"
              />
            )}
          </span>
        </button>
      </div>

      <div className={`speaker-volume absolute top-44 flex items-center gap-2 ${flashlightPosition === 'left' ? 'left-5' : 'right-5'}`}>
        <button
          type="button"
          className="action-button speaker-volume__button"
          onClick={() => setVolumeSliderOpen((isOpen) => !isOpen)}
          aria-label="Adjust microphone volume"
          aria-expanded={volumeSliderOpen}
        >
          <SpeakerWaveIcon className="size-12" />
        </button>
        {volumeSliderOpen && (
          <label className="flex h-32 flex-col items-center gap-1" aria-label="Microphone volume">
            <span className="text-xs">{playbackGain.toFixed(1)}x</span>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={playbackGain}
              onChange={(event) => handlePlaybackGainChange(Number(event.target.value))}
              className="h-24 w-2 cursor-pointer accent-slate-400"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
              aria-label="Microphone volume gain"
            />
          </label>
        )}
      </div>

      <div className="arm-toggle absolute bottom-5 left-center">
        <button type="button" className="action-button arm-toggle__button" onClick={onToggleArmed}>
          {armed ? <LockOpenIcon className="size-12" /> : <LockClosedIcon className="size-12" />}
        </button>
      </div>
    </>
  );
}

export default ActionButtons;
