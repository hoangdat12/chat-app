import { FC } from 'react';
import { AvatarOnline } from '../avatars/Avatar';

export interface IUserBoxProp {
  avatarUrl: string;
  userName: string;
  status?: string;
}

const UserBox: FC<IUserBoxProp> = ({
  avatarUrl,
  userName,
  status = 'offline',
}) => {
  return (
    <div className='flex gap-3'>
      <AvatarOnline
        avatarUrl={avatarUrl}
        className={`h-14 w-14 md:h-11 md:w-11`}
        status={status}
      />
      <div className='text-black font-poppins'>
        <h1 className='text-lg'>{userName}</h1>
        <p className='text-[12px] text-gray-500'>Connected</p>
      </div>
    </div>
  );
};

export default UserBox;
