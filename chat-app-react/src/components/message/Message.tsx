import { FC, memo, useEffect, useRef, useState } from 'react';

import Avatar from '../avatars/Avatar';
import './index.scss';
import { IoIosMore } from 'react-icons/io';
import { IMessage } from '../../ultils/interface';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  deleteMessage,
  updateMessage,
} from '../../features/message/messageSlice';
import { messageService } from '../../features/message/messageService';
import {
  selectConversation,
  updateLastMessage,
} from '../../features/conversation/conversationSlice';
import { convertMessageObjectIdToString } from '../../ultils';

export interface IPropMessage {
  className?: string;
  messages: IMessage[];
  myMessage?: boolean;
  timeSendMessage: string | null;
  messageType: string | undefined;
}

export interface IMessageBoxProps {
  message: IMessage;
  myMessage: boolean | undefined;
  showItem: string;
  setShowItem: (value: string) => void;
  handleDeleteMessage: (message: IMessage) => void;
  handleEditMessage: (message: IMessage) => Promise<IMessage>;
}

export const Message: FC<IPropMessage> = memo(
  ({ messages, className, myMessage, timeSendMessage, messageType }) => {
    const [showItem, setShowItem] = useState('');
    const dispatch = useAppDispatch();

    const { conversations } = useAppSelector(selectConversation);

    const handleDeleteMessage = async (message: IMessage) => {
      dispatch(deleteMessage(message));
      const data = {
        message_id: message._id,
        conversation_type: messageType,
        conversationId: message.message_conversation,
      };
      const response = await messageService.deleteMessageOfConversation(data);
      const conversation = conversations.get(message.message_conversation);
      if (conversation?.lastMessage._id === message._id) {
        console.log('updateLast');
        const payload = {
          conversation,
          lastMessage: convertMessageObjectIdToString(response.data),
        };
        dispatch(updateLastMessage(payload));
        console.log(conversation);
      }
      setShowItem('');
    };

    const handleEditMessage = async (message: IMessage): Promise<IMessage> => {
      dispatch(updateMessage(message));
      const data = {
        message_id: message._id,
        conversation_type: messageType,
        conversationId: message.message_conversation,
        message_content: message.message_content,
      };
      const messageUpdate = await messageService.updateMessageOfConversation(
        data
      );
      setShowItem('');
      // update if delete or update last message
      const conversation = conversations.get(message.message_conversation);
      if (conversation?.lastMessage?._id === message._id) {
        const payload = {
          conversation,
          lastMessage: message,
        };
        dispatch(updateLastMessage(payload));
      }
      return messageUpdate.data.metaData;
    };

    return (
      <>
        <div className='flex items-center justify-center mt-6 text-[12px] '>
          {timeSendMessage}
        </div>
        <div
          className={`${className} flex ${
            myMessage && 'flex-col-reverse'
          } items-end justify-center mt-2`}
        >
          <Avatar
            className={`${
              myMessage ? 'hidden' : 'flex'
            } w-8 h-8 sm:w-10 sm:h-10 items-end`}
            avatarUrl={messages[0].message_sender_by?.avatarUrl}
          />
          <div
            className={`relative hover-message-show-time flex flex-col-reverse ${
              myMessage && 'items-end'
            } w-full`}
          >
            {messages.map((message) => {
              return (
                <div key={message._id} className='w-full'>
                  <MessageBox
                    message={message}
                    myMessage={myMessage}
                    showItem={showItem}
                    setShowItem={setShowItem}
                    handleDeleteMessage={handleDeleteMessage}
                    handleEditMessage={handleEditMessage}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
);

const MessageBox: FC<IMessageBoxProps> = ({
  message,
  myMessage,
  showItem,
  setShowItem,
  handleDeleteMessage,
  handleEditMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // const modalRef = useRef<HTMLDivElement>(null);
  const [updateMessage, setUpdateMessage] = useState(false);
  const [updateMessageValue, setUpdateMessageValue] = useState('');

  const activeUpdateMessageChange = (message: IMessage) => {
    setUpdateMessage(true);
    setUpdateMessageValue(message.message_content);
    setShowItem('');
  };

  useEffect(() => {
    if (updateMessage) {
      const handleClickOutSide = (e: MouseEvent) => {
        if (
          inputRef?.current &&
          !inputRef?.current?.contains(e.target as Node)
        ) {
          setUpdateMessage(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutSide);
      return () => {
        document.removeEventListener('mousedown', handleClickOutSide);
      };
    }
  }, [updateMessage]);

  useEffect(() => {
    if (updateMessageValue !== '') {
      const enterEvent = async (e: any) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          if (updateMessageValue !== message.message_content) {
            const { message_content, ...payload } = message;
            const updateMessage = await handleEditMessage({
              ...payload,
              message_content: updateMessageValue,
            });
            console.log(updateMessage);
            if (updateMessage) {
              setUpdateMessage(false);
            }
          } else {
            setUpdateMessage(false);
          }
        }
      };

      document.addEventListener('keydown', enterEvent);

      return () => {
        document.removeEventListener('keydown', enterEvent);
      };
    }
  }, [updateMessageValue]);

  return (
    <div
      className={`relative ${
        !updateMessage && 'hover-message-show-button'
      } flex gap-2 items-center ${
        myMessage ? 'justify-end' : 'pl-2'
      } mt-2 w-full`}
    >
      <div className={`relative ${!myMessage && 'order-2'}`}>
        <button
          className={`${
            showItem === message._id ? 'block' : 'hidden'
          } show-button-more cursor-pointer px-2 py-1`}
          onClick={() => {
            setShowItem(message._id);
          }}
        >
          <IoIosMore />
        </button>

        <div
          className={`absolute left-[50%] -translate-x-1/2 ${
            showItem === message._id ? 'flex' : 'hidden'
          } flex-col items-center w-[100px] ${
            myMessage ? 'h-20 -top-[90px]' : '-top-[60px]'
          } bg-white shadow-test z-10 rounded-md p-1`}
          // ref={modalRef}
        >
          <button
            className='flex items-center justify-center min-h-[2.25rem] w-full hover:bg-slate-200 duration-300 z-10'
            onClick={() => handleDeleteMessage(message)}
          >
            Delete
          </button>

          <button
            className={`${
              myMessage ? 'flex' : 'hidden'
            } items-center justify-center min-h-[2.25rem] w-full hover:bg-slate-200 duration-300`}
            onClick={() => activeUpdateMessageChange(message)}
          >
            Edit
          </button>
        </div>
      </div>
      {!updateMessage ? (
        <p
          className={`max-w-[80%] text-sm sm:text-base px-2 sm:px-3 py-1 ${
            myMessage ? 'bg-sky-500 text-white' : 'bg-[#f2f3f4] order-1'
          } rounded-xl`}
        >
          {message.message_content}
        </p>
      ) : (
        <input
          className={`border-none outline-none w-auto px-2 sm:px-3 py-1 bg-sky-500 text-white rounded-xl`}
          value={updateMessageValue}
          onChange={(e) => setUpdateMessageValue(e.target.value)}
          autoFocus={true}
          ref={inputRef}
        ></input>
      )}
    </div>
  );
};

export default Message;
