import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectCall, setIsMini } from '../../features/call/callSlice';
import CallControll from './VideoCallControll';
import { getUserAvatar } from '../../pages/callerPage/AudioCall';
import { IParticipant } from '../../ultils/interface';
import Avatar from '../avatars/Avatar';
import { useNavigate } from 'react-router-dom';

const VoiceCallHidden = () => {
  const recRef = useRef<HTMLDivElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [friend, setFriend] = useState<IParticipant | null>(null);
  const [style, setStyle] = useState({ transform: `translate(100px, 100px)` });

  const { localStream, remoteStream, caller, receiver } =
    useAppSelector(selectCall);
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

  const handleNavigate = () => {
    dispatch(setIsMini(false));
    navigate('/call');
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

  useEffect(() => {
    const getUser = () => {
      const { friend } = getUserAvatar(caller, receiver);
      setFriend(friend);
    };
    getUser();
  }, [caller, receiver]);

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
        <div className='relative w-full h-full flex items-center justify-center'>
          <audio
            className='w-full h-full'
            ref={remoteVideoRef}
            playsInline
            autoPlay
          ></audio>
          {friend && (
            <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col gap-2 items-center justify-center'>
              <Avatar
                avatarUrl={friend.avatarUrl}
                className='w-20 h-20 min-h-[5rem] min-w-[5rem] object-cover overflow-hidden'
              />
              <h1 className='px-4 py-1 rounded text-white sm:text-lg'>
                {friend.userName}
              </h1>
            </div>
          )}
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

export default VoiceCallHidden;
