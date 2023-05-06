import { useEffect } from "react";

const LoginSuccess = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`absolute flex items-center justify-center w-full h-full top-0 left-0 bottom-0 right-0 bg-blackOverlay`}
    >
      <span className='loading-spinner'></span>
    </div>
  );
};

export default LoginSuccess;
