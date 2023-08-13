import { AiOutlineCheck, AiOutlineClose } from 'react-icons/Ai';
import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { resetState, selectCall } from '../../features/call/callSlice';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { HandleCallType } from '../../ultils/interface';
import { SocketCall } from '../../ultils/constant';

const CallReceiveDialog = () => {
  const { caller, callType, activeConversationId } = useAppSelector(selectCall);
  const socket = useContext(SocketContext);
  const [timer, setTimer] = useState(30);
  const dispatch = useAppDispatch();

  const handleCall = (type: HandleCallType) => {
    const payload = { caller, conversationId: activeConversationId };
    switch (type) {
      case 'accept':
        return callType === 'video'
          ? socket.emit(SocketCall.VIDEO_CALL_ACCEPTED, payload)
          : socket.emit(SocketCall.VOICE_CALL_ACCEPTED, payload);
      case 'reject':
        return callType === 'video'
          ? socket.emit(SocketCall.VIDEO_CALL_REJECTED, payload)
          : socket.emit(SocketCall.VOICE_CALL_REJECTED, payload);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    if (timer <= 0) {
      dispatch(resetState());
      return clearInterval(interval);
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
            'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg'
          }
          className='w-32 h-32'
        />
        <div className='flex gap-3 flex-col items-center mt-4'>
          <p className='text-lg text-[#9da2a9]'>Incoming call</p>
          <h1 className='rounded text-white text-lg sm:text-3xl'>Hoang Dat</h1>
          <span className='text-lg text-[#9da2a9] px-3 py-1 rounded-lg border border-white mt-2'>
            {timer}s
          </span>
        </div>
      </div>
      <div className='absolute bototm-4 sm:bottom-6 flex items-center justify-center gap-6 mt-20 w-full'>
        <div
          onClick={() => handleCall('reject')}
          className='flex flex-col items-center justify-center gap-1 cursor-pointer'
        >
          <span className='p-5 text-white text-2xl rounded-full bg-red-500'>
            <AiOutlineClose />
          </span>
          <Button text={'Close'} border='border-none' color='text-[#9da2a9]' />
        </div>
        <div
          onClick={() => handleCall('accept')}
          className='flex flex-col items-center justify-center gap-1'
        >
          <span className='p-5 text-white text-2xl rounded-full bg-blue-500 cursor-pointer'>
            <AiOutlineCheck />
          </span>
          <Button text={'Accept'} border='border-none' color='text-[#9da2a9]' />
        </div>
      </div>
    </div>
  );
};

export default CallReceiveDialog;
