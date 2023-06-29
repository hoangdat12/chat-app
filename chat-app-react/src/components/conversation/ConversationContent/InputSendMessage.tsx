import { FC } from 'react';
import { ButtonRounded } from '../../../pages/conversation/Conversation';
import { MdAttachFile } from 'react-icons/md';
import { AiOutlineFileImage, AiOutlinePlusCircle } from 'react-icons/Ai';

export interface IPropInputSendMessage {
  inputRef: any;
  messageValue: string;
  setMessageValue: (value: string) => void;
  handleSendMessage: () => void;
}

const InputSendMessage: FC<IPropInputSendMessage> = ({
  inputRef,
  messageValue,
  setMessageValue,
  handleSendMessage,
}) => {
  return (
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
          onChange={(e) => setMessageValue(e.target.value)}
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
  );
};

export default InputSendMessage;
