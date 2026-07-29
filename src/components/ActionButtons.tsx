import { BoltIcon, BoltSlashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

type ActionButtonsProps = {
  flashlightOn: boolean;
  armed: boolean;
  onToggleFlashlight: () => void;
  onToggleArmed: () => void;
};

function ActionButtons({
  flashlightOn,
  armed,
  onToggleFlashlight,
  onToggleArmed,
}: ActionButtonsProps) {
  return (
    <>
      <div className="flash-light-toggle absolute left-5">
        <button type="button" className="flash-light-toggle__button" onClick={onToggleFlashlight}>
          {flashlightOn ? <BoltIcon className="size-12" /> : <BoltSlashIcon className="size-12" />}
        </button>
      </div>

      <div className="arm-toggle absolute bottom-5 left-center">
        <button type="button" className="arm-toggle__button" onClick={onToggleArmed}>
          {armed ? <LockOpenIcon className="size-12" /> : <LockClosedIcon className="size-12" />}
        </button>
      </div>
    </>
  );
}

export default ActionButtons;
