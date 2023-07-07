import { FC, MouseEventHandler } from 'react';
import Avatar, { AvatarOnline } from '../avatars/Avatar';
import Button from '../button/Button';
import { IFriend } from '../../ultils/interface/friend.interface';

export interface IUserBoxProp {
  avatarUrl: string;
  userName: string;
  status?: string;
}

export interface IUserAddFriendProp {
  avatarUrl: string;
  userName: string;
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
  avatarUrl,
  userName,
  handleConfirm,
  handleDelete,
  handleViewProfile,
}) => {
  return (
    <div className='flex gap-3'>
      <Avatar
        onClick={handleViewProfile}
        avatarUrl={avatarUrl}
        className={`h-14 w-14 md:h-11 md:w-11`}
      />
      <div className='text-black font-poppins'>
        <h1 onClick={handleViewProfile} className='text-lg w-full'>
          {userName}
        </h1>
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

export default UserBox;
