import { useEffect, useRef, useState } from 'react';
import Button from '../button/Button';
import Overlay from '../common/Overlay';
import useClickOutside from '../../hooks/useClickOutside';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  selectCall,
  setEndCall,
  setTimeEndCall,
} from '../../features/call/callSlice';
import { getTimeCall } from '../../ultils';

const CallEndNotify = () => {
  const [countDown, setCountDown] = useState(3);
  const modelRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const { timeStartCall, timeEndCall } = useAppSelector(selectCall);

  const handleClose = () => {
    dispatch(setEndCall(false));
    dispatch(setTimeEndCall(undefined));
  };

  useClickOutside(modelRef, handleClose, 'mousedown');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);

    if (countDown <= 0) {
      handleClose();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countDown]);

  return (
    <Overlay className='z-[1001]'>
      <div
        ref={modelRef}
        className='relative flex flex-col items-center justify-center w-[380px] h-[260px] rounded-xl bg-white shadow-default'
      >
        <h1 className='text-3xl'>Call Ended</h1>
        <p className='mt-2 text-[#9da2a9]'>{`In ${
          timeEndCall &&
          timeStartCall &&
          getTimeCall(timeStartCall, timeEndCall)
        }`}</p>
        <div className='absolute bottom-5 right-5 flex gap-2'>
          <Button
            text={'Close'}
            className='w-[60px] bg-red-500 text-white border-none'
            onClick={handleClose}
          />
          <Button
            text={'Call'}
            className='w-[60px] bg-blue-500 text-white border-none'
          />
        </div>
      </div>
    </Overlay>
  );
};

export default CallEndNotify;
