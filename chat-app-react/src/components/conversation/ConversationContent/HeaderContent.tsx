import { MdOutlineArrowBack, MdOutlineArrowForward } from 'react-icons/md';
import Avatar from '../../avatars/Avatar';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsPinAngle } from 'react-icons/bs';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import {
  FC,
  MouseEventHandler,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ButtonRounded } from '../../button/ButtonRounded';
import { IConversation, IParticipant, IUser } from '../../../ultils/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../../ultils/context/Socket';
import { initiateCallState } from '../../../features/call/callSlice';
import { useAppDispatch } from '../../../app/hook';
import {
  convertUserToParticipant,
  getUserLocalStorageItem,
  getUserNameAndAvatarUrl,
} from '../../../ultils';
import { SocketCall } from '../../../ultils/constant';
import { userService } from '../../../features/user/userService';
import NotAllowed from '../../NotAllowed';
import { setIsError } from '../../../features/showError';

export interface IPropHeaderContent {
  handleShowMoreConversation: MouseEventHandler<HTMLAnchorElement>;
  handleShowListConversation?: () => void;
  showListConversationSM?: boolean;
  conversation: IConversation;
  userId?: string | null;
  isValidSendMessage?: boolean;
}

const userLocal = getUserLocalStorageItem();

const getParticipants = (user: IUser, participants: IParticipant[]) => {
  for (let participant of participants) {
    if (user._id !== participant.userId) return participant;
    else continue;
  }
  return participants[1];
};

export const hanldeCallVideo = async (
  conversationId: string | undefined,
  socket: any,
  conversation: IConversation,
  dispatch: any
) => {
  if (!conversationId) return;
  const data = {
    conversationId: conversationId,
    caller: convertUserToParticipant(userLocal),
    receiver: getParticipants(userLocal, conversation.participants),
  };
  socket.emit(SocketCall.ON_VIDEO_CALL_REQUEST, data);
  const constraints = { video: true, audio: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const payload = {
    ...data,
    localStream: stream,
    isCalling: true,
    activeConversationId: conversationId,
    callType: 'video',
    timeStartCall: new Date(),
  };
  if (!payload) throw new Error('Video Call Payload is undefined.');
  dispatch(initiateCallState(payload));
};

export const hanldeCallAudio = async (
  conversationId: string | undefined,
  socket: any,
  conversation: IConversation,
  dispatch: any
) => {
  if (!conversationId) return;
  socket.emit(SocketCall.ON_AUDIO_CALL_REQUEST, {
    conversationId: conversationId,
    caller: convertUserToParticipant(userLocal),
    receiver: getParticipants(userLocal, conversation.participants),
  });
  const constraints = { video: false, audio: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const payload = {
    localStream: stream,
    caller: convertUserToParticipant(userLocal),
    receiver: getParticipants(userLocal, conversation.participants),
    isCalling: true,
    activeConversationId: conversationId.toString(),
    callType: 'voice',
    timeStartCall: new Date(),
  };
  if (!payload) throw new Error('Audio Call Payload is undefined.');
  dispatch(initiateCallState(payload));
};

const HeaderContent: FC<IPropHeaderContent> = memo(
  ({
    handleShowMoreConversation,
    handleShowListConversation,
    showListConversationSM,
    conversation,
    userId,
    isValidSendMessage,
  }) => {
    const [isOnline, setIsOnline] = useState(false);
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const socket = useContext(SocketContext);

    const getInforChatFromConversation = useCallback(getUserNameAndAvatarUrl, [
      conversation,
    ]);
    const {
      userName,
      avatarUrl,
      userId: conversationUserId,
    } = getInforChatFromConversation(
      userLocal,
      conversation
    ) as IInforConversation;

    useEffect(() => {
      const handleCheckUserOnline = async () => {
        if (conversationUserId) {
          const res = await userService.checkUserOnline(conversationUserId);
          if (res.status === 200) {
            setIsOnline(res.data.metaData.isOnline);
          } else {
            dispatch(setIsError());
          }
        }
      };

      handleCheckUserOnline();
    }, [conversation]);
    return (
      <div className='relative flex items-center justify-between h-16 sm:h-[5.5rem] px-4 sm:px-8 w-full shadow-nomal'>
        {/* Mobile */}
        <div className='mr-2 block sm:hidden'>
          <ButtonRounded
            className={'text-base p-1'}
            icon={<MdOutlineArrowBack />}
            to='/conversation/all/list'
          />
        </div>
        {/* Reponsive for sm */}
        <div className='mr-4 hidden sm:block md:hidden'>
          <span
            onClick={handleShowListConversation}
            className='flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer'
          >
            {showListConversationSM ? (
              <MdOutlineArrowBack />
            ) : (
              <MdOutlineArrowForward />
            )}
          </span>
        </div>
        {/* All */}
        <div className='flex w-full gap-3 cursor-pointer '>
          <div onClick={() => navigate(`/profile/${userId}`)}>
            <Avatar
              className={
                'md:min-h-[3.5rem] md:min-w-[3.5rem] md:w-14 md:h-14 min-h-[3rem] min-w-[3rem] h-12 w-12'
              }
              avatarUrl={avatarUrl ?? ''}
            />
          </div>
          <div className='w-user-conversation flex flex-col justify-center'>
            <div className=''>
              <h1 className='text-base sm:text-lg md:text-xl font-bold'>
                {userName}
              </h1>
              {conversation?.conversation_type === 'conversation' && (
                <span
                  className={`${
                    isOnline && 'text-green-500'
                  } text-[10px] sm:text-[12px] font-medium`}
                >
                  {isOnline ? 'online' : 'offline'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 text-blue-500'>
          <ButtonRounded className={'hidden md:flex'} icon={<BsPinAngle />} />
          <ButtonRounded
            className={'text-base p-1 sm:text-lg md:text-[22px] sm:p-2'}
            icon={<IoCallOutline />}
            onClick={() =>
              hanldeCallAudio(conversationId, socket, conversation, dispatch)
            }
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-lg md:text-[22px] sm:p-2'}
            icon={<IoVideocamOutline />}
            onClick={() =>
              hanldeCallVideo(conversationId, socket, conversation, dispatch)
            }
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-lg md:text-[22px] sm:p-2'}
            icon={<IoIosInformationCircleOutline />}
            onClick={handleShowMoreConversation}
          />
        </div>
        <NotAllowed isValidSendMessage={!isValidSendMessage} />
      </div>
    );
  }
);

export interface IInforConversation {
  userName: string | null;
  avatarUrl: string | null;
  status: string | null;
  userId?: string | null;
  receiveNotification?: boolean;
}

export default HeaderContent;
