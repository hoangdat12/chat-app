import { FC } from 'react';
import AvatarSquare from '../avatars/AvatarSquare';

export interface IFriendBoxProp {
  avatarUrl: string;
  userName: string;
  width?: string;
  height?: string;
  fontSize?: string;
  margin?: string;
}

const FriendBox: FC<IFriendBoxProp> = ({
  avatarUrl,
  userName,
  width,
  height,
  fontSize,
  margin,
}) => {
  return (
    <div className='flex flex-col flex-wrap'>
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

export default FriendBox;
