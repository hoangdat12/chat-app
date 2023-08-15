import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectCall, setIsMini } from '../../features/call/callSlice';
import CallControll from './VideoCallControll';
import { useNavigate } from 'react-router-dom';

const CallHidden = () => {
  const recRef = useRef<HTMLDivElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [style, setStyle] = useState({ transform: `translate(100px, 100px)` });

  const { localStream, remoteStream } = useAppSelector(selectCall);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDragStart = (e: any) => {
    if (recRef.current) {
      let mouseX = e.clientX;
      let mouseY = e.clientY;
      let rect = recRef.current.getBoundingClientRect();
      setOffsetX(mouseX - rect.left);
      setOffsetY(mouseY - rect.top);
    }
  };

  const handleDrag = (e: any) => {
    if (recRef.current) {
      let mouseX = e.clientX;
      let mouseY = e.clientY;
      if (mouseX > 0 && mouseY > 0) {
        setStyle({
          transform: `translate(${mouseX - offsetX}px, ${mouseY - offsetY}px)`,
        });
      }
    }
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleNavigate = () => {
    dispatch(setIsMini(false));
    navigate('/call');
  };

  return (
    <div
      ref={recRef}
      draggable='true'
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      className='absolute flex items-center justify-center w-[240px] h-[320px] bg-[#414143] cursor-pointer rounded-md shadow-default z-[1001] hover-message-show-button'
      style={style}
    >
      <div
        className='relative flex items-center justify-center w-full h-full duration-300 hover:bg-blackOverlay text-white'
        onClick={handleNavigate}
      >
        <div>
          <video
            className='w-full h-full'
            ref={remoteVideoRef}
            playsInline
            autoPlay
          ></video>
        </div>

        <span className='absolute show-button-more hidden justify-center text-sm duration-300 top-5 z-[1]'>
          Click to back Call
        </span>

        {/* <div className='absolute bottom-3 right-3 z-[2]'>
          <video
            className='w-12 h-12 object-cover overflow-hidden rounded-full'
            ref={localVideoRef}
            playsInline
            autoPlay
          ></video>
        </div> */}
      </div>

      <CallControll
        position='absolute bottom-4 left-0 right-0'
        size='text-lg w-9 h-9'
      />
    </div>
  );
};

export default CallHidden;
