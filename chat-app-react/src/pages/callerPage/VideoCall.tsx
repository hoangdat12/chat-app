import { ButtonHTMLAttributes, FC, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { resetState, selectCall } from '../../features/call/callSlice';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/avatars/Avatar';
import CallControll from '../../components/call/VideoCallControll';
import CallOption from '../../components/call/CallOption';

const VideoCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCallInProgress, localStream, remoteStream } =
    useAppSelector(selectCall);

  useEffect(() => {
    if (!isCallInProgress) {
      dispatch(resetState());
      navigate(-1);
    }
  }, [isCallInProgress]);

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

  return (
    <div className='relative w-screen h-screen bg-[#414143]'>
      <div className='w-full h-full flex items-center justify-center'>
        {remoteStream && remoteStream?.getVideoTracks()[0]?.enabled ? (
          <video
            className='w-full h-full'
            ref={remoteVideoRef}
            playsInline
            autoPlay
          ></video>
        ) : (
          <div className='flex flex-col gap-2 items-center justify-center'>
            <Avatar
              avatarUrl={
                'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg'
              }
              className='w-32 h-32 min-h-[8rem] min-w-[8rem]'
            />
            <h1 className='px-4 py-1 rounded text-white text-lg sm:text-xl'>
              Hoang Dat
            </h1>
          </div>
        )}
      </div>
      <div className='sm:absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-end justify-center sm:justify-between px-10'>
        <CallOption />
        <CallControll
          position='absolute sm:static bottom-6 sm:bottom-8 left-0 right-0 '
          size='text-xl sm:text-2xl w-12 h-12 sm:w-14 sm:h-14'
        />
        <div className='absolute sm:static top-4 right-4 flex items-center gap-3'>
          <div className='w-24 h-24 rounded-full overflow-hidden'>
            <video
              className='w-full h-full object-cover'
              ref={localVideoRef}
              playsInline
              autoPlay
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  background?: string;
}

export const Button: FC<Props> = ({
  className,
  active,
  background,
  children,
  ...props
}) => {
  return (
    <button
      className={`${className} ${
        active
          ? background
            ? background
            : 'bg-white bg-opacity-[0.03] hover:bg-opacity-[0.3]'
          : ' bg-transparent'
      } rounded-full transition duration-500 flex items-center justify-center border-none outline-none cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
};

export default VideoCall;
