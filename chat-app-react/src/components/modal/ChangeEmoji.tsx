import { FC, useState } from 'react';
import { ButtonRounded } from '../button/ButtonRounded';
import { MdOutlineArrowBack } from 'react-icons/md';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useAppDispatch } from '../../app/hook';
import { changEmojiOfConversation } from '../../features/conversation/conversationSlice';
import { useParams } from 'react-router-dom';

export interface IChangeEmojiProp {
  isShow: boolean;
  setIsShow: (value: boolean) => void;
}

const ChangeEmoji: FC<IChangeEmojiProp> = ({ isShow, setIsShow }) => {
  const [currentEmoji, setCurrentEmoji] = useState<any>(null);

  const { conversationId } = useParams();
  const dispatch = useAppDispatch();

  const handleSelectEmoji = (emoji: any): void => {
    setCurrentEmoji(emoji);
  };

  const handleClose = () => {
    setIsShow(false);
  };

  const handleSave = () => {
    if (conversationId && currentEmoji) {
      const payload = {
        conversationId: conversationId,
        emoji: currentEmoji.native,
      };
      dispatch(changEmojiOfConversation(payload));
    }
    handleClose();
  };

  return (
    <div
      className={`${
        isShow ? 'block' : 'hidden'
      } fixed top-0 left-0 bottom-0 right-0 w-full flex items-center justify-center h-screen py-6 sm:py-0 bg-gray-200 sm:bg-blackOverlay z-[1000]`}
    >
      <div className='flex flex-col items-center justify-between animate__animated animate__fadeInDown w-full sm:w-[60%] lg:w-[40%] sm:bg-white h-full sm:h-[90%] sm:py-6 sm:rounded-md'>
        <div className='flex gap-4 items-center justify-start w-full px-4'>
          <ButtonRounded
            className={'text-lg p-2 bg-white'}
            icon={<MdOutlineArrowBack />}
          />
          <h1 className='text-xl '>Change Emoji</h1>
        </div>

        <Picker data={data} onEmojiSelect={handleSelectEmoji} />

        <div className='flex items-center justify-end w-full px-6'>
          <span className='text-4xl'>{currentEmoji?.native}</span>
        </div>

        <div className='flex items-center justify-end w-full px-4'>
          <div className='flex gap-3'>
            <button
              onClick={handleClose}
              className='px-4 py-1 rounded-lg border'
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-1 rounded-lg bg-blue-500 text-white cursor-pointer`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmoji;
