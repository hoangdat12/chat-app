import { FC, MouseEventHandler, useCallback } from 'react';
import Avatar, { AvatarOnline } from '../avatars/Avatar';
import Button from '../button/Button';
import { IFriend } from '../../ultils/interface/friend.interface';
import { INotify } from '../../ultils/interface';

export interface IUserBoxProp {
  avatarUrl: string;
  userName: string;
  status?: string;
}

export interface IUserAddFriendProp {
  notify: INotify;
  handleConfirm: (userAddFriend: IFriend) => void;
  handleDelete: (userAddFriend: IFriend) => void;
  handleViewProfile: MouseEventHandler<HTMLDivElement>;
}

const UserBox: FC<IUserBoxProp> = ({ avatarUrl, userName, status }) => {
  return (
    <div className='flex gap-3'>
      {status ? (
        <AvatarOnline
          avatarUrl={avatarUrl}
          className={`h-14 w-14 md:h-11 md:w-11`}
          status={status}
        />
      ) : (
        <Avatar avatarUrl={avatarUrl} className={`h-14 w-14 md:h-11 md:w-11`} />
      )}
      <div className='text-black font-poppins'>
        <h1 className='text-lg'>{userName}</h1>
        <p className='text-[12px] text-gray-500'>Connected</p>
      </div>
    </div>
  );
};

export const UserAddFriend: FC<IUserAddFriendProp> = ({
  notify,
  handleConfirm,
  handleDelete,
  handleViewProfile,
}) => {
  return (
    <div className='flex gap-3'>
      <Avatar
        onClick={handleViewProfile}
        avatarUrl={notify.notify_image}
        className={`h-14 w-14 md:h-11 md:w-11`}
      />
      <div className='text-black font-poppins'>
        <FormatTitleNotify title={notify.notify_content} />
        <div className='flex gap-3 mt-1 font-normal'>
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
  );
};

export interface IPropFormatTitleNotify {
  title: string;
}

export const FormatTitleNotify: FC<IPropFormatTitleNotify> = ({ title }) => {
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
  return <h1 className='text-lg w-full'>{titleFormatted()}</h1>;
};

export default UserBox;
