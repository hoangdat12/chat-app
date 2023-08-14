import {
  BsCameraVideoOffFill,
  BsFillCameraVideoFill,
  BsFillMicMuteFill,
} from 'react-icons/bs';
import { Button } from '../../pages/callerPage/VideoCall';
import { AiFillAudio } from 'react-icons/Ai';
import { MdCallEnd } from 'react-icons/md';
import { FC, useContext, useState } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { SocketCall } from '../../ultils/constant';
import { useAppSelector } from '../../app/hook';
import { selectCall } from '../../features/call/callSlice';

export interface IPropCallControll {
  position: string;
  size: string;
}

const VoiceCallControll: FC<IPropCallControll> = ({ position, size }) => {
  const [disableAudio, setDisableAudio] = useState(false);
  const [disableVideo, setDisableVideo] = useState(false);
  const socket = useContext(SocketContext);

  const { localStream, caller, receiver } = useAppSelector(selectCall);

  const closeCall = () => {
    socket.emit(SocketCall.VOICE_CALL_CLOSE, { caller, receiver });
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
        localStream.getAudioTracks()[0].enabled = prev;
        return !prev;
      });
  };

  return (
    <div className={`${position} flex items-center justify-center gap-3`}>
      <Button
        className={`text-black ${size}`}
        active={true}
        background='bg-white hover:bg-gray-300'
        onClick={handleDisableAudio}
      >
        {disableAudio ? <BsFillMicMuteFill /> : <AiFillAudio />}
      </Button>
      <Button
        className={`text-black ${size}`}
        active={true}
        background='bg-white hover:bg-gray-300'
        onClick={handleDisableVideo}
      >
        {disableVideo ? <BsCameraVideoOffFill /> : <BsFillCameraVideoFill />}
      </Button>
      <Button
        className={`text-white ${size}`}
        active={true}
        background='bg-red-500 hover:bg-red-700'
        onClick={closeCall}
      >
        <MdCallEnd />
      </Button>
    </div>
  );
};
export default VoiceCallControll;
