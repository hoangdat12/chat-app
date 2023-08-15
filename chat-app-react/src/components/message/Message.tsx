import { FC, memo, useState } from 'react';

import Avatar from '../avatars/Avatar';
import { IMessage } from '../../ultils/interface';
import MessageBox from './MessageBox';
import { MessageContentType } from '../../ultils/constant';
import CallMessage from './CallMessage';

export interface IPropMessage {
  className?: string;
  messages: IMessage[];
  myMessage?: boolean;
  timeSendMessage: string | null;
}

export const Message: FC<IPropMessage> = memo(
  ({ messages, className, myMessage, timeSendMessage }) => {
    const [showItem, setShowItem] = useState('');
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
            } w-8 h-8 min-w-[32px] min-h-[32px] sm:w-10 sm:h-10 sm:min-h-[40px] sm:min-w-[40px] items-end`}
            avatarUrl={messages[0].message_sender_by?.avatarUrl}
          />
          <div
            className={`relative hover-message-show-time flex flex-col-reverse ${
              myMessage && 'items-end'
            } w-full`}
          >
            {messages.map((message) => {
              return message.message_content_type ===
                MessageContentType.VIDEO_CALL ||
                message.message_content_type ===
                  MessageContentType.VOICE_CALL ? (
                <div key={message._id} className='w-full'>
                  <CallMessage myMessage={myMessage} message={message} />
                </div>
              ) : (
                <div key={message._id} className='w-full'>
                  <MessageBox
                    message={message}
                    myMessage={myMessage}
                    showItem={showItem}
                    setShowItem={setShowItem}
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

export default Message;
