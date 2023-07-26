import { useEffect } from 'react';

const useEnterListener = (handleEnter: any, dependence: string | any) => {
  useEffect(() => {
    if (dependence.trim() !== '') {
      const handleEnterEvent = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          handleEnter();
        }
      };

      window.addEventListener('keydown', handleEnterEvent);

      return () => {
        window.removeEventListener('keydown', handleEnterEvent);
      };
    }
  }, [dependence]);
};

export default useEnterListener;
