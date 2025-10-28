const Loader: React.FC<{
  light?: boolean;
  width?: number;
  height?: number;
}> = ({ light = false, width = 5, height = 5 }) => {
  return (
    <span className="flex justify-center items-center ">
      <div
        className={`animate-spin rounded-full h-${height} w-${width} border-t-2 ${light ? 'border-white' : 'border-stone-900'} border-opacity-60`}
      ></div>
    </span>
  );
};

export default Loader;
