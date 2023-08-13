import {
  ButtonHTMLAttributes,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AiFillAudio } from 'react-icons/Ai';
import {
  BsCameraVideoOffFill,
  BsFillCameraVideoFill,
  BsFillChatFill,
  BsFillMicMuteFill,
  BsFillPersonPlusFill,
} from 'react-icons/bs';
import { MdCallEnd } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { resetState, selectCall } from '../../features/call/callSlice';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../ultils/context/Socket';
import { SocketCall } from '../../ultils/constant';
import Avatar from '../avatars/Avatar';

const VideoCall = () => {
  const socket = useContext(SocketContext);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [disableAudio, setDisableAudio] = useState(false);
  const [disableVideo, setDisableVideo] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCalling, localStream, remoteStream, caller, receiver } =
    useAppSelector(selectCall);

  // useEffect(() => {
  //   if (!isCalling) {
  //     dispatch(resetState());
  //     navigate(-1);
  //   }
  // }, [isCalling]);

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

  const closeCall = () => {
    socket.emit(SocketCall.VIDEO_CALL_CLOSE, { caller, receiver });
  };

  const handleDisableVideo = () => {
    localStream &&
      setDisableVideo((prev) => {
        localStream.getVideoTracks()[0].enabled = prev;
        return !prev;
      });
  };

  const handleDisableAudio = () => {
    localStream &&
      setDisableAudio((prev) => {
        console.log(prev);
        localStream.getAudioTracks()[0].enabled = prev;
        return !prev;
      });
  };

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
              className='w-32 h-32'
            />
            <h1 className='px-4 py-1 rounded text-white text-lg sm:text-xl'>
              Hoang Dat
            </h1>
          </div>
        )}
      </div>
      <div className='sm:absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-end justify-center sm:justify-between px-10'>
        <div className='absolute sm:static top-4 left-4 flex gap-2'>
          <Button
            className='text-white w-10 h-10 sm:w-12 sm:h-12'
            active={true}
          >
            <BsFillChatFill />
          </Button>
          <Button
            className='text-white w-10 h-10 sm:w-12 sm:h-12'
            active={true}
          >
            <BsFillPersonPlusFill />
          </Button>
        </div>
        <div className='absolute sm:static bottom-6 sm:bottom-8 left-0 right-0 flex items-center justify-center gap-3'>
          <Button
            className='text-black text-xl sm:text-2xl w-12 h-12 sm:w-14 sm:h-14'
            active={true}
            background='bg-white hover:bg-gray-300'
            onClick={handleDisableAudio}
          >
            {disableAudio ? <BsFillMicMuteFill /> : <AiFillAudio />}
          </Button>
          <Button
            className='text-black text-xl sm:text-2xl w-12 h-12 sm:w-14 sm:h-14'
            active={true}
            background='bg-white hover:bg-gray-300'
            onClick={handleDisableVideo}
          >
            {disableVideo ? (
              <BsCameraVideoOffFill />
            ) : (
              <BsFillCameraVideoFill />
            )}
          </Button>
          <Button
            className='text-white text-xl sm:text-2xl w-12 h-12 sm:w-14 sm:h-14'
            active={true}
            background='bg-red-500 hover:bg-red-700'
            onClick={closeCall}
          >
            <MdCallEnd />
          </Button>
        </div>
        <div className='absolute sm:static top-4 right-4 flex items-center gap-3'>
          <div className='w-24 h-24'>
            <video
              className='w-full h-full'
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

{
  /* <div className='h-full w-full bg-red-500'>
        <div className='relative h-[70%] bg-gray-500'>
          <div className='absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 py-2'>
            <h1 className='bg-blackOverlay px-4 py-1 rounded text-white text-sm sm:text-base'>
              Hoang Dat
            </h1>
            <Avatar
              avatarUrl={
                'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg'
              }
              className='w-12 h-12'
            />
          </div>
        </div>

        <div className='h-1/5 bg-yellow-500'></div>
      </div> */
}

export default VideoCall;
