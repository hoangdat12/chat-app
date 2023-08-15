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
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectCall } from '../../features/call/callSlice';
import { getTimeCall } from '../../ultils';
import { sendMessageCallVideo } from './CallReceiveDialog';
import { selectConversation } from '../../features/conversation/conversationSlice';

export interface IPropCallControll {
  position: string;
  size: string;
}

const VoiceCallControll: FC<IPropCallControll> = ({ position, size }) => {
  const [disableAudio, setDisableAudio] = useState(false);
  const [disableVideo, setDisableVideo] = useState(false);
  const socket = useContext(SocketContext);

  const dispatch = useAppDispatch();
  const {
    localStream,
    caller,
    receiver,
    callType,
    activeConversationId,
    timeStartCall,
  } = useAppSelector(selectCall);
  const { conversations } = useAppSelector(selectConversation);

  const closeCall = async () => {
    const conversation = conversations.get(activeConversationId ?? '');
    if (!conversation) return;
    const data = {
      message_content: `End Call`,
      // missing | accept
      message_call: {
        status: 'accept',
        caller,
        receiver,
        time: getTimeCall(timeStartCall, new Date()),
      },
    };
    await sendMessageCallVideo(
      caller,
      receiver,
      callType,
      conversation,
      timeStartCall,
      dispatch,
      data
    );
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
