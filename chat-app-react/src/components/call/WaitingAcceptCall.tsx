import { useContext, useEffect, useState } from 'react';
import { PhoneRingingCancel } from './CallRinging/PhoneRinging';
import Avatar from '../avatars/Avatar';
import { resetState, selectCall } from '../../features/call/callSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { SocketCall } from '../../ultils/constant';
import { SocketContext } from '../../ultils/context/Socket';
import { selectConversation } from '../../features/conversation/conversationSlice';
import { sendMessageCallVideo } from './CallReceiveDialog';

const WaitingAcceptCall = () => {
  const [timer, setTimer] = useState(30);

  const dispatch = useAppDispatch();
  const { activeConversationId, callType, caller, receiver, localStream } =
    useAppSelector(selectCall);
  const { conversations } = useAppSelector(selectConversation);
  const socket = useContext(SocketContext);

  const handleCreateMessageCallVideo = async () => {
    const conversation = conversations.get(activeConversationId ?? '');
    if (!conversation) return;
    const data = {
      message_content: `${receiver?.userName} missed your's call`,
      // missing | accept
      message_call: {
        status: 'missing',
        caller,
        receiver,
      },
    };
    await sendMessageCallVideo(
      caller,
      receiver,
      callType,
      conversation,
      undefined,
      dispatch,
      data
    );
  };
  const handleReject = async () => {
    await handleCreateMessageCallVideo();
    dispatch(resetState());
    const payload = { receiver };
    socket.emit(SocketCall.SENDER_REJECT_CALL, payload);
    localStream &&
      localStream.getTracks().forEach((track) => {
        console.log(localStream.id);
        track.stop();
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    if (timer <= 0) {
      handleReject();
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[#3e4651] z-[1001]'>
      <div className='absolute top-[20%] flex flex-col items-center gap-2 w-full h-full'>
        <Avatar
          avatarUrl={
            receiver?.avatarUrl ??
            'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg'
          }
          className='w-32 h-32 min-h-[8rem] min-w-[8rem]'
        />
        <div className='flex gap-3 flex-col items-center mt-4'>
          <h1 className='rounded text-white text-lg sm:text-3xl'>
            {receiver?.userName ?? 'Hoang Dat'}
          </h1>
          <span className='text-lg text-[#9da2a9] px-3 py-1 rounded-lg border border-white mt-2'>
            {timer}s
          </span>
        </div>
      </div>
      <div className='absolute bottom-20 left-0 right-0'>
        <div
          onClick={handleReject}
          className='flex flex-col items-center justify-center gap-1 cursor-pointer'
        >
          <PhoneRingingCancel />
        </div>
      </div>
    </div>
  );
};

export default WaitingAcceptCall;
