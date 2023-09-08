import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { resetState, selectCall } from '../../features/call/callSlice';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import {
  HandleCallType,
  IConversation,
  IDataCreateMessage,
  IParticipant,
} from '../../ultils/interface';
import {
  MessageContentType,
  MessageType,
  SocketCall,
} from '../../ultils/constant';
import PhoneRinging, { PhoneRingingCancel } from './CallRinging/PhoneRinging';
import { messageService } from '../../features/message/messageService';
import { createNewMessage } from '../../features/message/messageSlice';
import {
  createNewMessageOfConversation,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { setIsError } from '../../features/showError';
import { useNavigate } from 'react-router-dom';

export const sendMessageCallVideo = async (
  caller: IParticipant | undefined,
  receiver: IParticipant | undefined,
  callType: string | undefined,
  conversation: IConversation,
  timeStartCall: Date | undefined,
  dispatch: any,
  data: any
) => {
  // const conversation = conversations.get(conversationId ?? '');
  if (conversation && caller && receiver) {
    const body: IDataCreateMessage = {
      conversationId: conversation._id,
      participants: conversation.participants,
      message_content_type:
        callType === 'video'
          ? MessageContentType.VIDEO_CALL
          : MessageContentType.VOICE_CALL,
      message_type: MessageType.CONVERSATION,
      ...data,
      createdAt: timeStartCall,
      message_sender_by: caller,
    };
    const res = await messageService.createNewMessage(body);
    if (res.status === 201) {
      dispatch(createNewMessage(res.data.metaData));
      const dataUpdate = {
        lastMessage: res.data.metaData,
        conversationId: conversation._id,
      };
      dispatch(createNewMessageOfConversation(dataUpdate));
    } else {
      dispatch(setIsError());
    }
  }
};

const CallReceiveDialog = () => {
  const socket = useContext(SocketContext);
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);
  const { caller, receiver, callType, activeConversationId, timeStartCall } =
    useAppSelector(selectCall);

  const handleCreateMessageCallVideo = async () => {
    const conversation = conversations.get(activeConversationId ?? '');
    if (!conversation) return;
    const data = {
      message_content: `You missed ${caller?.userName}'s call`,
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
      timeStartCall,
      dispatch,
      data
    );
  };

  const handleCall = async (type: HandleCallType) => {
    const payload = { caller, conversationId: activeConversationId };
    switch (type) {
      case 'accept':
        return callType === 'video'
          ? socket.emit(SocketCall.VIDEO_CALL_ACCEPTED, payload)
          : socket.emit(SocketCall.VOICE_CALL_ACCEPTED, payload);
      case 'reject':
        await handleCreateMessageCallVideo();
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
      const handleReject = async () => {
        await handleCreateMessageCallVideo();
        dispatch(resetState());
        const payload = { caller, conversationId: activeConversationId };
        callType === 'video'
          ? socket.emit(SocketCall.VIDEO_CALL_REJECTED, payload)
          : socket.emit(SocketCall.VOICE_CALL_REJECTED, payload);
        return clearInterval(interval);
      };
      handleReject();
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[#3e4651] z-[1001]'>
      <div className='absolute top-[20%] flex flex-col items-center gap-2 w-full'>
        <Avatar
          avatarUrl={
            caller?.avatarUrl ??
            'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg'
          }
          className='w-32 h-32 min-h-[8rem] min-w-[8rem]'
        />
        <div className='flex gap-3 flex-col items-center mt-4'>
          <p className='text-lg text-[#9da2a9]'>Incoming call</p>
          <h1 className='rounded text-white text-lg sm:text-3xl'>
            {caller?.userName ?? 'Hoang Dat'}
          </h1>
          <span className='text-lg text-[#9da2a9] px-3 py-1 rounded-lg border border-white mt-2'>
            {timer}s
          </span>
        </div>
      </div>
      <div className='absolute bottom-16 flex items-center justify-center mt-20 w-full'>
        <div
          onClick={() => handleCall('reject')}
          className='flex flex-col items-center justify-center gap-1 cursor-pointer'
        >
          <PhoneRingingCancel />
        </div>
        <div
          onClick={() => handleCall('accept')}
          className='flex flex-col items-center justify-center gap-1'
        >
          <PhoneRinging />
        </div>
      </div>
      <div className='absolute top-4 right-4'>
        <Button
          text={'Go back'}
          className='bg-blue-500 text-white border-none'
          onClick={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default CallReceiveDialog;
