import { FC } from 'react';
import Avatar, { AvatarOnline } from '../avatars/Avatar';

export interface IUserBoxProp {
  avatarUrl: string;
  userName: string;
  status?: string;
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
        <Avatar
          avatarUrl={avatarUrl}
          className={`h-14 w-14 min-w-[3.5rem] min-h-[3.5rem] md:h-11 md:w-11 md:min-w-[2.75rem] md:min-h-[2.75rem]`}
        />
      )}
      <div className='text-black font-poppins'>
        <h1 className='text-lg'>{userName}</h1>
        <p className='text-[12px] text-gray-500'>Connected</p>
      </div>
    </div>
  );
};

export default UserBox;
