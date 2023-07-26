import { useEffect } from 'react';

const useEnterListener = (
  handleEnter: any,
  dependence: string | any,
  condition: boolean = true
) => {
  useEffect(() => {
    if (dependence.trim() !== '' && condition) {
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
