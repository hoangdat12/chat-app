import { FC, memo, useState } from 'react';

import Avatar from '../avatars/Avatar';
import { IMessage } from '../../ultils/interface';
import MessageBox from './MessageBox';
import { MessageContentType } from '../../ultils/constant';
import CallMessage from './CallMessage';
import { useNavigate } from 'react-router-dom';

export interface IPropMessage {
  className?: string;
  messages: IMessage[];
  myMessage?: boolean;
  timeSendMessage: string | null;
}

export const Message: FC<IPropMessage> = memo(
  ({ messages, className, myMessage, timeSendMessage }) => {
    const [showItem, setShowItem] = useState('');
    const navigate = useNavigate();

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
          <div
            onClick={() =>
              navigate(`/profile/${messages[0].message_sender_by.userId}`)
            }
          >
            <Avatar
              className={`${
                myMessage ? 'hidden' : 'flex'
              } w-8 h-8 min-w-[32px] min-h-[32px] sm:w-10 sm:h-10 sm:min-h-[40px] sm:min-w-[40px] items-end`}
              avatarUrl={messages[0].message_sender_by?.avatarUrl}
            />
          </div>
          <div
            className={`relative hover-message-show-time flex flex-col-reverse ${
              myMessage && 'items-end'
            } w-full`}
          >
            {messages.map((message) => {
              switch (message.message_content_type) {
                case MessageContentType.VIDEO_CALL:
                  return (
                    <div key={message._id} className='w-full'>
                      <CallMessage myMessage={myMessage} message={message} />
                    </div>
                  );
                case MessageContentType.VOICE_CALL:
                  return (
                    <div key={message._id} className='w-full'>
                      <CallMessage myMessage={myMessage} message={message} />
                    </div>
                  );
                case MessageContentType.NOTIFY:
                  return (
                    <div
                      key={message._id}
                      className='flex w-full items-center justify-center text-xs text-gray-500'
                    >
                      {message.message_content}
                    </div>
                  );
                default:
                  return (
                    <div key={message._id} className='w-full'>
                      <MessageBox
                        message={message}
                        myMessage={myMessage}
                        showItem={showItem}
                        setShowItem={setShowItem}
                      />
                    </div>
                  );
              }
            })}
          </div>
        </div>
      </>
    );
  }
);

export default Message;
