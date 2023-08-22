import { FC, MouseEventHandler, useCallback, useRef, useState } from 'react';
import { IFriend, INotify } from '../../ultils/interface';
import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { NotifyType } from '../../ultils/constant';
import { CiCircleMore } from 'react-icons/ci';
import useClickOutside from '../../hooks/useClickOutside';
import { useAppDispatch } from '../../app/hook';
import { deleteNotify } from '../../features/notify/notifySlice';
import { notifyService } from '../../features/notify/notifyService';
import { useNavigate } from 'react-router-dom';
import { setIsError } from '../../features/showError';

export interface IPropNotify {
  notify: INotify;
  handleConfirm: (userAddFriend: IFriend) => void;
  handleDelete: (userAddFriend: IFriend) => void;
  handleViewProfile: MouseEventHandler<HTMLDivElement>;
  fontSize?: string;
  className?: string;
}

export const Notify: FC<IPropNotify> = ({
  notify,
  handleConfirm,
  handleDelete,
  handleViewProfile,
  fontSize,
  className,
}) => {
  const [show, setShow] = useState(false);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const handleShowOptions = () => {
    setShow(!show);
  };

  const navigate = useNavigate();

  useClickOutside(modelRef, () => setShow(false), 'mousedown');

  const handleDeleteNotify = async () => {
    if (notify.notify_type !== NotifyType.ADD_FRIEND) {
      const res = await notifyService.deleteNotify(notify._id);
      if (res.status === 200) {
        dispatch(deleteNotify(notify));
      } else {
        dispatch(setIsError());
      }
    }
  };

  return (
    <div className={`${className} flex items-center justify-between`}>
      <div className='flex gap-3 items-center'>
        <Avatar
          onClick={handleViewProfile}
          avatarUrl={notify.notify_image}
          className={`h-16 w-16 min-h-[4rem] min-w-[4rem]`}
        />

        <div
          onClick={
            notify.notify_link ? () => navigate(notify.notify_link) : undefined
          }
          className='text-black font-poppins'
        >
          <FormatTitleNotify
            title={notify.notify_content}
            fontSize={fontSize ?? 'text-[15px]'}
          />
          <div
            className={`${
              notify.notify_type === NotifyType.ADD_FRIEND ? 'flex' : 'hidden'
            } gap-3 mt-1 font-normal`}
          >
            <Button
              text={'Confirm'}
              color={'text-slate-700'}
              paddingY={'py-[2px]'}
              background={'bg-white'}
              fontSize={'text-sm'}
              hover={'hover:bg-blue-500 hover:text-white'}
              border={'border-none'}
              onClick={handleConfirm}
            />
            <Button
              text={'Delete'}
              color={'text-black'}
              paddingY={'py-[2px]'}
              background={'bg-white'}
              fontSize={'text-sm'}
              hover={'hover:bg-black hover:text-white'}
              border={'border-none'}
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>

      <div
        onClick={handleShowOptions}
        className={`relative ${
          notify.notify_type === NotifyType.ADD_FRIEND && 'hidden'
        } cursor-pointer`}
      >
        <span onClick={handleShowOptions} className='text-xl'>
          <CiCircleMore />
        </span>
        <div
          ref={modelRef}
          className={`absolute bottom-6 left-1/2 -translate-x-[60%] ${
            !show && 'hidden'
          }`}
        >
          <Button
            text={'Delete'}
            fontSize={'text-sm'}
            className='bg-black text-white px-2'
            border={'border-none'}
            paddingY={'py-1'}
            onClick={handleDeleteNotify}
          />
        </div>
      </div>
    </div>
  );
};

export interface IPropFormatTitleNotify {
  title: string;
  fontSize: string;
}

export const FormatTitleNotify: FC<IPropFormatTitleNotify> = ({
  title,
  fontSize,
}) => {
  const regex = /\*\*(.*?)\*\*/g;
  const titleFormatted = useCallback(() => {
    return title.split(regex).map((part, index) => {
      // If the part is enclosed in ** **, apply bold style
      if (index % 2 === 1) {
        return <b key={index}>{part}</b>;
      }
      return part;
    });
  }, [title, regex]);
  return (
    <h1
      className={`${fontSize} w-full max-h-[48px] text-content line-clamp-2 cursor-pointer`}
    >
      {titleFormatted()}
    </h1>
  );
};
