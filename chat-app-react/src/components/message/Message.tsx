import { FC, memo, useRef, useState } from 'react';

import Avatar from '../avatars/Avatar';
import './index.scss';
import { IoIosMore } from 'react-icons/io';
import { IMessage } from '../../ultils/interface';
import { useAppDispatch } from '../../app/hook';
import { deleteMessage } from '../../features/message/messageSlice';
import { messageService } from '../../features/message/messageService';

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
  modalRef: any;
  handleDeleteMessage: (message: IMessage) => void;
  handleEditMessage: (message: IMessage) => void;
}

export const Message: FC<IPropMessage> = memo(
  ({ messages, className, myMessage, timeSendMessage, messageType }) => {
    const [showItem, setShowItem] = useState('');

    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const handleDeleteMessage = async (message: IMessage) => {
      dispatch(deleteMessage(message));
      const data = {
        messageId: message._id,
        conversation_type: messageType,
        conversationId: message.message_conversation,
      };
      await messageService.deleteMessageOfConversation(data);
      setShowItem('');
    };

    const handleEditMessage = (message: IMessage) => {
      console.log(message);
    };

    // useEffect(() => {
    //   if (showItem !== '') {
    //     const handleClickOutSide = (e: MouseEvent) => {
    //       if (
    //         modalRef?.current &&
    //         !modalRef?.current?.contains(e.target as Node)
    //       ) {
    //         setShowItem('');
    //       }
    //     };
    //     document.addEventListener('mousedown', handleClickOutSide);
    //     return () => {
    //       document.removeEventListener('mousedown', handleClickOutSide);
    //     };
    //   }
    // }, [showItem]);

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
                    modalRef={modalRef}
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
  modalRef,
  handleDeleteMessage,
  handleEditMessage,
}) => {
  return (
    <div
      className={`relative hover-message-show-button flex gap-2 items-center ${
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
          ref={modalRef}
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
            onClick={() => handleEditMessage(message)}
          >
            Edit
          </button>
        </div>
      </div>
      <p
        className={`max-w-[80%] text-sm sm:text-base px-2 sm:px-3 py-1 ${
          myMessage ? 'bg-sky-500 text-white' : 'bg-[#f2f3f4] order-1'
        } rounded-xl`}
      >
        {message.message_content}
      </p>
    </div>
  );
};

export default Message;
