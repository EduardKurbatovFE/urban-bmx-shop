import Loader from '@/components/Loader';

const Loading = () => {
  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <Loader size="lg" />
    </div>
  );
};

export default Loading;
