import { FC, useRef } from 'react';
import Button from '../button/Button';
import { IChangeNickNameProp } from './ChangeNickName';
import useClickOutside from '../../hooks/useClickOutside';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  handleDeleteConversation,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { useNavigate } from 'react-router-dom';
import { deleteAllMessageOfConversation } from '../../features/message/messageSlice';

export interface IPropConfirm extends IChangeNickNameProp {
  title: string;
}

const Confirm: FC<IPropConfirm> = ({
  conversation,
  title,
  isShow,
  setIsShow,
}) => {
  const confirmRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { conversations } = useAppSelector(selectConversation);
  const handleClose = () => {
    setIsShow(false);
  };

  const handleSave = async () => {
    if (conversation) {
      dispatch(handleDeleteConversation(conversation._id));
      dispatch(deleteAllMessageOfConversation());
      const nextConversation = Array.from(conversations.values())[0];
      navigate(`/conversation/${nextConversation?._id ?? 1}`);
    }
    setIsShow(false);
  };

  useClickOutside(confirmRef, handleClose, 'mousedown');

  return (
    <div
      className={`${
        isShow ? 'flex' : 'hidden'
      } fixed top-0 left-0 bottom-0 right-0 items-center justify-center w-screen h-screen bg-blackOverlay z-[1000]`}
    >
      <div
        ref={confirmRef}
        className={`flex flex-col py-4 animate__animated animate__fadeInDown bg-white rounded-lg overflow-hidden`}
      >
        <h1 className='text-xl sm:text-2xl max-w-[80%] text-center mx-auto'>
          {title}
        </h1>
        <div className={`flex justify-end gap-2 mt-12 px-4`}>
          <Button
            text={'Close'}
            fontSize={'text-sm'}
            border={'border-none'}
            hover={'hover:bg-gray-200 duration-300'}
            paddingY={'py-2'}
            paddingX={'px-4'}
            onClick={handleClose}
          />
          <Button
            text={'Save'}
            fontSize={'text-sm'}
            border={'border-none'}
            background={'bg-blue-500'}
            color={'text-white'}
            hover={'hover:bg-blue-700 duration-300'}
            paddingY={'py-2'}
            paddingX={'px-4'}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default Confirm;
