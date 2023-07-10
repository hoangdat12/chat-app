import { FC, memo, useRef, useState } from 'react';
import { MdOutlineInsertEmoticon } from 'react-icons/md';
import { AiOutlineFileImage, AiOutlineClose } from 'react-icons/Ai';

import { ButtonFile } from '../../button/ButtonFile';
import { ButtonRounded } from '../../button/ButtonRounded';
import useClickOutside from '../../../hooks/useClickOutside';
import { IConversation } from '../../../ultils/interface';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export interface IPropInputSendMessage {
  inputRef: any;
  messageValue: string;
  handleSendEmoji: (emoji: any) => void;
  conversation: IConversation | undefined;
  setMessageValue: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const InputSendMessage: FC<IPropInputSendMessage> = memo(
  ({
    inputRef,
    messageValue,
    setMessageValue,
    conversation,
    handleSendEmoji,
    images,
    setImages,
    files,
    setFiles,
  }) => {
    const [showEmoji, setShowEmoji] = useState(false);
    const [, setCurrentEmoji] = useState<any>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    const handleCloseEmoji = () => {
      setShowEmoji(false);
    };

    useClickOutside<HTMLDivElement>(emojiRef, handleCloseEmoji, 'mousedown');

    // Close image not upload
    const handleDeleteImage = (imageDeleted: string) => {
      const updateImages = images.filter((image) => image !== imageDeleted);
      setImages(updateImages);
      URL.revokeObjectURL(imageDeleted);
    };

    const handleShowEmoji = () => {
      setShowEmoji(true);
    };

    const handleSelectEmoji = (emoji: any) => {
      setCurrentEmoji(emoji);
      setMessageValue((prev: string) => `${prev}${emoji.emoji}`);
    };

    return (
      <div className='relative flex items-center gap-3 sm:gap-4 min-h-[4rem] sm:min-h-[5rem] px-2 sm:px-6 '>
        <div className='flex gap-2 text-blue-500'>
          <ButtonFile
            className={'text-base p-1 sm:text-[22px] sm:p-2'}
            icon={<AiOutlineFileImage />}
            images={images}
            setImages={setImages}
            files={files}
            setFiles={setFiles}
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-[22px] sm:p-2'}
            icon={<MdOutlineInsertEmoticon />}
            onClick={handleShowEmoji}
          />
        </div>

        <div
          ref={emojiRef}
          className={`absolute bottom-[60px] animate__animated animate__bounceIn ${
            showEmoji ? 'block' : 'hidden'
          } mx-auto`}
        >
          <Picker data={data} onEmojiSelect={handleSelectEmoji} />
        </div>

        <div className='relative flex flex-col w-full'>
          <div
            className={`${
              images.length !== 0 ? 'block' : 'hidden'
            } absolute bottom-[40px] left-0 grid grid-cols-4 gap-2 bg-gray-100 w-full p-4 rounded-tl rounded-tr`}
          >
            {images.length !== 0 &&
              images.map((image) => (
                <div key={image} className='relative col-span-1'>
                  <img src={image} alt='' className='w-full object-cover' />
                  <span
                    onClick={() => handleDeleteImage(image)}
                    className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 p-1 bg-gray-50 rounded-full cursor-pointer'
                  >
                    <AiOutlineClose />
                  </span>
                </div>
              ))}
          </div>
          <div className='flex items-center gap-2 sm:gap-4 pl-3 sm:pl-4 w-full bg-[#f2f3f4] rounded-lg overflow-hidden'>
            <input
              type='text'
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              ref={inputRef}
              placeholder='Enter your message...'
              className='text-sm sm:text-base font-medium w-full py-2 outline-none bg-transparent'
            />
            <button
              onClick={() => handleSendEmoji(conversation?.emoji ?? '👍')}
              className='p-1 text-xl sm:text-2xl text-white'
            >
              {conversation?.emoji ?? '👍'}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default InputSendMessage;
