import { FC, useEffect, useRef, useState } from 'react';
import { IMessage } from '../../ultils/interface';
import OptionMessage from '../modal/OptionMessage';
import { MessageContentType } from '../../ultils/constant/message.constant';

export interface IPropMessageBox {
  message: IMessage;
  myMessage: boolean | undefined;
  showItem: string;
  setShowItem: (value: string) => void;
}

const MessageBox: FC<IPropMessageBox> = ({
  message,
  myMessage,
  showItem,
  setShowItem,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // const modalRef = useRef<HTMLDivElement>(null);
  const [updateMessageValue, setUpdateMessageValue] = useState('');
  const [updateMessage, setUpdateMessage] = useState(false);

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

  return (
    <div
      className={`relative ${
        !updateMessage && 'hover-message-show-button'
      } flex gap-2 items-center ${
        myMessage ? 'justify-end' : 'pl-2'
      } mt-2 w-full`}
    >
      <div className={`relative ${!myMessage && 'order-2'}`}>
        <OptionMessage
          showItem={showItem === message._id}
          setShowItem={setShowItem}
          isOwn={myMessage ?? false}
          message={message}
          activeUpdateMessageChange={activeUpdateMessageChange}
          updateMessageValue={updateMessageValue}
          setUpdateMessage={setUpdateMessage}
        />
      </div>
      {message.message_content_type === MessageContentType.IMAGE ? (
        <img src={message.message_content} className='max-w-[80%]' />
      ) : !updateMessage ? (
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
export default MessageBox;
