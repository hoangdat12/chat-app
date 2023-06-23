import { FC, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

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
}

export interface IPropModelOptionOfComment {
  setShowItem: (value: string) => void;
  showItem: string;
  messageId: string;
  myMessage: boolean | undefined;
}

export const Message: FC<IPropMessage> = ({
  messages,
  className,
  myMessage,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const [showItem, setShowItem] = useState('');
  let timeAgo = null;

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
      {myMessage ? (
        <div
          className={`${className} flex flex-col-reverse items-end justify-center mt-3`}
        >
          <div className='relative hover-message-show-time flex flex-col-reverse items-end w-full'>
            {messages.map((message, idx) => {
              // const timeAgo = calculatorTime(message.createdAt);
              timeAgo = formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              });
              return (
                <div
                  key={idx}
                  className='relative hover-message-show-button flex gap-2 items-center justify-end w-full mt-2'
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <div className='relative'>
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
                  <p className='max-w-[80%] text-sm sm:text-base px-3 sm:px-4 py-1 bg-[#f2f3f4] rounded-xl '>
                    {message.message_content}
                  </p>
                </div>
              );
            })}
            <span
              className={`${
                showClass && 'show-time'
              } z-[1000] hidden absolute -top-6 right-0 text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap`}
            >
              {timeAgo}
            </span>
          </div>
        </div>
      ) : (
        <div className={`${className} flex items-end gap-3 mt-3`}>
          <Avatar
            className={'w-8 h-8 sm:w-10 sm:h-10 flex items-end'}
            avatarUrl={messages[0].message_sender_by?.avatarUrl}
          />
          <div className='flex flex-col-reverse w-full'>
            <div className='hover-message-show-time relative flex flex-col-reverse'>
              {messages.map((message, idx) => {
                timeAgo = formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                });
                return (
                  <div
                    key={idx}
                    className='relative hover-message-show-button flex gap-2 items-center mt-2'
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <p className='text-sm sm:text-base px-3 sm:px-4 py-1 max-w-[80%] bg-[#f2f3f4] rounded-xl'>
                      {message.message_content}
                    </p>
                    <div className='relative'>
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
                  </div>
                );
              })}
              <span
                className={`${
                  showClass && 'show-time'
                } z-[1000] hidden absolute -top-6 left-0 text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap`}
              >
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ModelOptionOfComment: FC<IPropModelOptionOfComment> = ({
  setShowItem,
  showItem,
  messageId,
  myMessage,
}) => {
  const dispatch = useAppDispatch();
  const handleDeleteMessage = (messageId: string) => {
    dispatch(deleteMessage(messageId));
    setShowItem('');
  };

  const handleEditMessage = () => {};

  return (
    <div
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
};

// export const calculatorTime = (timeStamp: string) => {
//   const date = new Date(timeStamp);
//   const now = new Date();

//   const differ = now.getTime() - date.getTime();

//   const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
//   let time: string;

//   // Intl.RelativeTimeFormat allows you to format a time relative to the current, using natural language syntax and other formatting options.
//   if (differ >= 31536000000) {
//     // More than a year
//     time = formatter.format(Math.floor(-differ / 31536000000), "year");
//   } else if (differ >= 2592000000) {
//     // More than a month
//     time = formatter.format(Math.floor(-differ / 2592000000), "month");
//   } else if (differ >= 86400000) {
//     // More than a day
//     time = formatter.format(Math.floor(-differ / 86400000), "day");
//   } else if (differ >= 3600000) {
//     // More than an hour
//     time = formatter.format(Math.floor(-differ / 3600000), "hour");
//   } else if (differ >= 60000) {
//     // More than a minute
//     time = formatter.format(Math.floor(-differ / 60000), "minute");
//   } else {
//     time = "just now";
//   }

//   return time;
// };

export default Message;
