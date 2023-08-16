import { FC } from 'react';
import AvatarSquare from '../avatars/AvatarSquare';
import { AvatarOnline } from '../avatars/Avatar';

export interface IFriendBoxProp {
  avatarUrl: string;
  userName: string;
  status?: string;
  className?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  margin?: string;
  onClick?: any;
  onlineStatus?: string;
}

const FriendBox: FC<IFriendBoxProp> = ({
  avatarUrl,
  userName,
  width,
  height,
  fontSize,
  margin,
  onClick,
}) => {
  return (
    <div onClick={onClick} className='flex flex-col flex-wrap'>
      <AvatarSquare
        avatarUrl={avatarUrl}
        className={`${width ?? 'w-full'} ${height ?? 'h-full'}`}
      />
      <h1 className={`${fontSize ?? 'text-base'} ${margin ?? 'mt-2'}`}>
        {userName}
      </h1>
    </div>
  );
};

export const FriendBoxCircle: FC<IFriendBoxProp> = ({
  userName,
  avatarUrl,
  className,
  status,
  onlineStatus,
}) => {
  return (
    <div className='flex gap-2 items-center cursor-pointer'>
      <AvatarOnline
        avatarUrl={avatarUrl}
        className={className}
        status={status}
      />
      <div>
        <h1 className='text-sm'>{userName}</h1>
        {onlineStatus && (
          <p className='text-xs text-gray-500'>{onlineStatus}</p>
        )}
      </div>
    </div>
  );
};

export default FriendBox;
