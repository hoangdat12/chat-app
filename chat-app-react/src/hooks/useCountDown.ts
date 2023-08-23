import { useEffect } from 'react';

export const useCountDown = (
  condition: boolean,
  handler: any,
  dependence: any,
  time?: number | 3000
) => {
  useEffect(() => {
    if (condition) {
      const timer = setTimeout(() => {
        handler();
      }, time || 3000);

      return () => clearTimeout(timer);
    }
  }, [dependence]);
};

// #example
// useEffect(() => {
//   if (showNotify) {
//     const timer = setTimeout(() => {
//       setShowNotify(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }
// }, [showNotify]);
