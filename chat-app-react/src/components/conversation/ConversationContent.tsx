import { FC, useEffect, useRef, useState, useContext, memo } from 'react';

import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsPinAngle } from 'react-icons/bs';
import { MdAttachFile, MdOutlineArrowBack } from 'react-icons/md';
import { AiOutlineFileImage, AiOutlinePlusCircle } from 'react-icons/Ai';

import Avatar, { AvatarOnline } from '../avatars/Avatar';
import { ButtonRounded } from '../../pages/conversation/Conversation';
import Message from '../message/Message';
import useInnerWidth from '../../hooks/useInnterWidth';
import myAxios from '../../ultils/myAxios';
import { createNewMessageOfConversation } from '../../features/conversation/conversationSlice';
import {
  selectMessage,
  fetchMessageOfConversation as fetchMessage,
  createNewMessage,
} from '../../features/message/messageSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { SocketContext } from '../../ultils/context/Socket';
import {
  IConversation,
  IDataFormatMessage,
  IMessage,
  IUser,
} from '../../ultils/interface';
import { calculatorTime } from '../../ultils';

export interface IPropConversationContent {
  user: IUser | null;
  conversation: IConversation | null;
  setShowMoreConversation?: (value: boolean) => void;
  showMoreConversation?: boolean;
}

export interface IPropContent {
  messages: IDataFormatMessage[];
  messageType: string | undefined;
}

const ConversationContent: FC<IPropConversationContent> = memo(
  ({ conversation, user, setShowMoreConversation, showMoreConversation }) => {
    const [messageValue, setMessageValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const innterWidth = useInnerWidth();
    const socket = useContext(SocketContext);

    const dispatch = useAppDispatch();
    const { messages, isLoading } = useAppSelector(selectMessage);
    const handleSendMessage = async () => {
      if (conversation) {
        const body = {
          message_type: conversation?.conversation_type,
          message_content: messageValue,
          conversationId: conversation?._id,
        };
        const res = await myAxios.post('/message', body);

        if (res.data.status === 200) {
          dispatch(createNewMessage(res.data.metaData));
          const dataUpdate = {
            lastMessage: res.data.metaData.message_content,
            lastMessageSendAt: res.data.metaData.createdAt,
            conversation,
          };
          dispatch(createNewMessageOfConversation(dataUpdate));
          setMessageValue('');
          inputRef.current?.focus();
        }
      }
    };

    const handleChangeMessageValue = (e: any) => {
      setMessageValue(e.target.value);
    };

    const handleShowMoreConversation = () => {
      if (setShowMoreConversation && innterWidth < 1280 && innterWidth >= 640) {
        setShowMoreConversation(!showMoreConversation);
      }
    };

    useEffect(() => {
      if (messageValue !== '') {
        const enterEvent = (e: any) => {
          if (e.key === 'Enter' || e.keyCode === 13) {
            handleSendMessage();
          }
        };

        document.addEventListener('keydown', enterEvent);

        return () => {
          document.removeEventListener('keydown', enterEvent);
        };
      }
    }, [messageValue]);
    useEffect(() => {
      if (conversation) {
        const data = {
          conversation_type: conversation.conversation_type,
          conversationId: conversation._id,
        };
        dispatch(fetchMessage(data));
      }
    }, [conversation]);

    useEffect(() => {
      socket.on('connection', (data) => {
        console.log('Connected');
        console.log(data);
      });
      socket.on('onMessage', (payload: any) => {
        const { message_sender_by, message_conversation } = payload;
        if (message_sender_by.userId === user?._id) {
          return;
        }
        if (message_conversation !== conversation?._id) {
          return;
        }
        dispatch(createNewMessage(payload));
      });
      return () => {
        socket.off('connection');
        socket.off('onMessage');
      };
    }, []);

    return (
      <div className='block xl:col-span-6 md:col-span-8 w-full h-full'>
        <div className='flex items-center justify-between h-16 sm:h-[5.5rem] px-4 sm:px-8 w-full shadow-nomal'>
          <div className='mr-2 block sm:hidden'>
            <ButtonRounded
              className={'text-base p-1'}
              icon={<MdOutlineArrowBack />}
              to='/conversation'
            />
          </div>
          <div className='flex w-full gap-3 cursor-pointer '>
            <div className=''>
              <Avatar
                className={'sm:w-14 sm:h-14 h-12 w-12'}
                avatarUrl={
                  'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1'
                }
              />
            </div>
            <div className='w-user-conversation flex flex-col justify-center'>
              <div className=''>
                <h1 className='text-base sm:text-xl font-bold'>Hoang Dat</h1>
                <span className='text-[10px] sm:text-[12px] font-medium '>
                  Active
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3 text-blue-500'>
            <ButtonRounded className={'hidden sm:flex'} icon={<BsPinAngle />} />
            <ButtonRounded
              className={'text-base p-1 sm:text-[22px] sm:p-2'}
              icon={<IoCallOutline />}
            />
            <ButtonRounded
              className={'text-base p-1 sm:text-[22px] sm:p-2'}
              icon={<IoVideocamOutline />}
            />
            <ButtonRounded
              className={'text-base p-1 sm:text-[22px] sm:p-2'}
              icon={<IoIosInformationCircleOutline />}
              onClick={handleShowMoreConversation}
              to='/conversation/setting'
            />
          </div>
        </div>

        <div className='max-h-[calc(100vh-13rem)] sm:max-h-[calc(100vh-15rem)] w-full mt-1 flex flex-col-reverse h-full px-4 sm:px-6 py-4 overflow-y-scroll'>
          {isLoading ? (
            <div>
              <span className='loading-spinner'></span>
            </div>
          ) : conversation?.conversation_type === 'group' ? (
            <ContentGroup
              messages={messages}
              messageType={conversation?.conversation_type}
            />
          ) : (
            <Content
              messages={messages}
              messageType={conversation?.conversation_type}
            />
          )}
        </div>

        <div className='flex items-center gap-3 sm:gap-4 h-16 sm:h-20 px-2 sm:px-6 '>
          <div className='flex gap-2 text-blue-500'>
            <ButtonRounded
              className={'text-base p-1 sm:text-[22px] sm:p-2'}
              icon={<AiOutlinePlusCircle />}
            />
            <ButtonRounded
              className={'text-base p-1 sm:text-[22px] sm:p-2'}
              icon={<MdAttachFile />}
            />
            <ButtonRounded
              className={'text-base p-1 sm:text-[22px] sm:p-2'}
              icon={<AiOutlineFileImage />}
            />
          </div>
          <div className='flex items-center gap-2 sm:gap-4 pl-4 w-full bg-[#f2f3f4] overflow-hidden rounded-xl'>
            <input
              type='text'
              value={messageValue}
              onChange={(e) => handleChangeMessageValue(e)}
              ref={inputRef}
              placeholder='Enter your message...'
              className='text-sm sm:text-base font-medium w-full py-2 outline-none bg-transparent'
            />
            <button
              className='py-2 px-2 sm:px-4 text-sm sm:text-base text-white rounded-xl bg-blue-500'
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export const Content: FC<IPropContent> = memo(({ messages, messageType }) => {
  return (
    <>
      {messages?.map((fmt, idx) => {
        return (
          <div key={idx}>
            <Message
              messages={fmt.messages}
              myMessage={fmt.myMessage}
              timeSendMessage={fmt.timeSendMessage}
              messageType={messageType}
            />
          </div>
        );
      })}
    </>
  );
});

export const ContentGroup: FC<IPropContent> = memo(({ messages }) => {
  return (
    <>
      {messages.map((messageFormat) => {
        return messageFormat.messages.map((message) => (
          <div key={message._id}>
            <UserBox isOwn={messageFormat.myMessage} message={message} />
          </div>
        ));
      })}
    </>
  );
});

export interface IUserBoxProp {
  isOwn: boolean;
  message: IMessage;
}

export const UserBox: FC<IUserBoxProp> = ({ isOwn, message }) => {
  return (
    <div className={`flex gap-3 p-4 ${isOwn && 'justify-end'}`}>
      <div className={`${isOwn && 'order-2'}`}>
        <AvatarOnline
          className={'w-8 h-8 sm:w-10 sm:h-10 '}
          avatarUrl={message.message_sender_by.avatarUrl}
          status='online'
        />
      </div>
      <div className={`flex flex-col gap-2 ${isOwn} && 'items-end`}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>
            {message.message_sender_by.userName}
          </div>
          <div className='text-xs text-gray-400'>
            {calculatorTime(message.createdAt)}
          </div>
        </div>
        <div
          className={` text-sm w-fit overflow-hidden px-2 py-[2px] rounded
    ${isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100'}`}
        >
          {/* <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} /> */}
          {/* {data.image ? (
          <Image
            alt="Image"
            height="288"
            width="288"
            onClick={() => setImageModalOpen(true)} 
            src={data.image} 
            className="
              object-cover 
              cursor-pointer 
              hover:scale-110 
              transition 
              translate
            "
          />
        ) : ( */}
          <div>{message.message_content}</div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default ConversationContent;
