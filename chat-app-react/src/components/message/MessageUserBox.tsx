import { FC, useRef, useState } from 'react';
import { IMessage } from '../../ultils/interface';
import { AvatarOnline } from '../avatars/Avatar';
import { calculatorTime } from '../../ultils';
import OptionMessage from '../modal/OptionMessage';
import { MessageContentType } from '../../ultils/constant/message.constant';
import { useNavigate } from 'react-router-dom';

export interface IMessageBoxGroupProp {
  isOwn: boolean;
  message: IMessage;
}

export const MessageBoxGroup: FC<IMessageBoxGroupProp> = ({
  isOwn,
  message,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showItem, setShowItem] = useState('');
  // const [updateMessage, setUpdateMessage] = useState(false);
  const [updateMessageValue, setUpdateMessageValue] = useState('');
  const [updateMessage, setUpdateMessage] = useState(false);

  const activeUpdateMessageChange = (message: IMessage) => {
    setUpdateMessage(true);
    setUpdateMessageValue(message.message_content);
    setShowItem('');
  };
  return (
    <div
      className={`flex gap-3 ${isOwn && 'justify-end'} ${
        message.message_content_type === MessageContentType.NOTIFY
          ? 'w-full pt-4'
          : 'max-w-[80%] p-4'
      } hover-message-show-button`}
    >
      {message.message_content_type === MessageContentType.NOTIFY ? (
        <div className='flex items-center justify-center w-full mx-auto text-gray-400 text-sm'>
          {message.message_content}
        </div>
      ) : (
        <>
          <div
            onClick={() =>
              navigate(`/profile/${message.message_sender_by.userId}`)
            }
            className={`${isOwn && 'order-2'}`}
          >
            <AvatarOnline
              className={'w-8 h-8 sm:w-10 sm:h-10 '}
              avatarUrl={message.message_sender_by.avatarUrl}
              status='online'
            />
          </div>
          <div className={`flex flex-col gap-2 ${isOwn && 'justify-end'}`}>
            <div className='flex items-center gap-1'>
              <div className='text-sm text-gray-500'>
                {message.message_sender_by.userName}
              </div>
              <div className='text-xs text-gray-400'>
                {calculatorTime(message.createdAt)}
              </div>
            </div>
            <div className='flex'>
              <div className={`relative`}>
                <div
                  className={`absolute top-[50%] -translate-y-1/2 ${
                    isOwn ? '-left-[40px]' : '-right-[40px] z-10'
                  }`}
                >
                  <OptionMessage
                    showItem={showItem === message._id}
                    setShowItem={setShowItem}
                    message={message}
                    isOwn={isOwn}
                    activeUpdateMessageChange={activeUpdateMessageChange}
                    updateMessageValue={updateMessageValue}
                    setUpdateMessage={setUpdateMessage}
                  />
                </div>
                {message.message_content_type === MessageContentType.IMAGE ? (
                  <img src={message.message_content} className='' />
                ) : (
                  <div
                    className={`text-sm px-2 py-[2px] rounded flex flex-wrap z-0 ${
                      isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100 order-2'
                    }`}
                  >
                    {!updateMessage ? (
                      <p
                        className={`${
                          message.message_content_type ===
                          MessageContentType.EMOJI
                            ? 'text-xl sm:text-2xl'
                            : 'text-base'
                        }`}
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
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageBoxGroup;
