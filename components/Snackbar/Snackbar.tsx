import CloseIcon from '@/icons/CloseIcon';
import { TSnackbarProps } from './types';

export default function Snackbar({
  text,
  handleClose,
  variant,
}: TSnackbarProps) {
  const variants = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="absolute right-4 top-4 ">
      <div
        className={`${variants[variant]} flex min-w-[320px] items-center truncate whitespace-nowrap rounded-lg py-3 px-3.5 text-xs text-white shadow-md`}
      >
        <span>{text}</span>
        <button
          className="ml-auto bg-transparent !p-0 text-current underline cursor-pointer"
          onClick={handleClose}
        >
          <CloseIcon width={10} height={10} />
        </button>
      </div>
    </div>
  );
}
