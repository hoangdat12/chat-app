import { useEffect } from 'react';

export const useCountDown = (
  condition: boolean,
  handler: any,
  dependence: any,
  time?: number | 2000
) => {
  useEffect(() => {
    if (condition) {
      const timer = setTimeout(() => {
        handler();
      }, time);

      return () => clearTimeout(timer);
    }
  }, [dependence]);
};

// #example
// useEffect(() => {
//   if (showNotify) {
//     const timer = setTimeout(() => {
//       setShowNotify(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }
// }, [showNotify]);
