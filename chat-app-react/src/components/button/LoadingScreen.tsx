const LoadingScreen = () => {
  return (
    <div
      className={`fixed flex items-center justify-center w-full h-full top-0 left-0 bottom-0 right-0 bg-blackOverlay z-[1002]`}
    >
      <span className='loading-spinner'></span>
    </div>
  );
};

export default LoadingScreen;
