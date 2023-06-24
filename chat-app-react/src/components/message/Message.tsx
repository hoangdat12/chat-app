import { FC, memo, useEffect, useRef, useState } from 'react';

import Avatar from '../avatars/Avatar';
import './index.scss';
import { IoIosMore } from 'react-icons/io';
import { IMessage } from '../../ultils/interface';
import { useAppDispatch } from '../../app/hook';
import { deleteMessage } from '../../features/message/messageSlice';

export interface IPropMessage {
  className?: string;
  messages: IMessage[];
  myMessage?: boolean;
  timeSendMessage: string | null;
}

export interface IPropModelOptionOfComment {
  setShowItem: (value: string) => void;
  showItem: string;
  messageId: string;
  myMessage: boolean | undefined;
}

export const Message: FC<IPropMessage> = memo(
  ({ messages, className, myMessage, timeSendMessage }) => {
    const [hovered, setHovered] = useState(false);
    const [, setShowClass] = useState(false);
    const [showItem, setShowItem] = useState('');
    const handleShowItem = (messageId: string) => {
      setShowItem(messageId);
    };

    useEffect(() => {
      if (hovered) {
        const timeoutId = setTimeout(() => {
          setShowClass(true);
        }, 1000);
        return () => clearTimeout(timeoutId);
      } else {
        setShowClass(false);
      }
    }, [hovered]);

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
            {messages.map((message, idx) => {
              return (
                <div
                  key={idx}
                  className={`relative hover-message-show-button flex gap-2 items-center ${
                    myMessage ? 'justify-end' : 'pl-2'
                  } mt-2 w-full`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <div className={`relative ${!myMessage && 'order-2'}`}>
                    <button
                      className={`${
                        showItem === message._id ? 'block' : 'hidden'
                      } show-button-more cursor-pointer px-2 py-1`}
                      onClick={() => handleShowItem(message._id)}
                    >
                      <IoIosMore />
                    </button>
                    <ModelOptionOfComment
                      setShowItem={setShowItem}
                      showItem={showItem}
                      messageId={message._id}
                      myMessage={myMessage}
                    />
                  </div>
                  <p
                    className={`max-w-[80%] text-sm sm:text-base px-2 sm:px-3 py-1 ${
                      myMessage
                        ? 'bg-sky-500 text-white'
                        : 'bg-[#f2f3f4] order-1'
                    } rounded-xl`}
                  >
                    {message.message_content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
);

const ModelOptionOfComment: FC<IPropModelOptionOfComment> = memo(
  ({ setShowItem, showItem, messageId, myMessage }) => {
    const modelRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const handleDeleteMessage = (messageId: string) => {
      dispatch(deleteMessage(messageId));
      setShowItem('');
    };

    const handleEditMessage = () => {};

    useEffect(() => {
      if (showItem !== '') {
        const handleClickOutSide = (e: MouseEvent) => {
          if (
            modelRef?.current &&
            !modelRef?.current?.contains(e.target as Node)
          ) {
            setShowItem('');
          }
        };
        document.addEventListener('mousedown', handleClickOutSide);
        return () => {
          document.removeEventListener('mousedown', handleClickOutSide);
        };
      }
    }, [showItem]);

    return (
      <div
        ref={modelRef}
        className={`absolute left-[50%] -translate-x-1/2 ${
          showItem === messageId ? 'flex' : 'hidden'
        } flex-col items-center w-[100px] ${
          myMessage ? 'h-20 -top-[90px]' : '-top-[60px]'
        } bg-white shadow-test z-10 rounded-md p-1`}
      >
        <button
          className='flex items-center justify-center min-h-[2.25rem] w-full hover:bg-slate-200 duration-300'
          onClick={() => handleDeleteMessage(messageId)}
        >
          Delete
        </button>
        <button
          className={`${
            myMessage ? 'flex' : 'hidden'
          } items-center justify-center min-h-[2.25rem] w-full hover:bg-slate-200 duration-300`}
          onClick={handleEditMessage}
        >
          Edit
        </button>
      </div>
    );
  }
);

export default Message;
