import { RefObject, useEffect } from 'react';

function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
  // condition?: boolean,
  dependence?: any
) {
  useEffect(() => {
    const handleMouseEvent = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    window.addEventListener(mouseEvent, handleMouseEvent);

    return () => {
      window.removeEventListener(mouseEvent, handleMouseEvent);
    };
  }, [dependence]);
}

export default useClickOutside;
