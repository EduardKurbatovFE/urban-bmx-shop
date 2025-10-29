const SIZES = {
  sm: 'w-5 h-5',
  md: 'w-10 h-10',
  lg: 'w-20 h-20',
} as const;

type Size = keyof typeof SIZES;

const Loader: React.FC<{
  light?: boolean;
  size?: Size;
}> = ({ light = false, size = 'sm' }) => {
  return (
    <span className="flex justify-center items-center ">
      <div
        className={`animate-spin rounded-full  ${SIZES[size]} border-t-2 ${light ? 'border-white' : 'border-stone-900'} border-opacity-60`}
      ></div>
    </span>
  );
};

export default Loader;
