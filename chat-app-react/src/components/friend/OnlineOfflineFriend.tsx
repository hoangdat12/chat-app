import { FC } from 'react';
import { FriendBoxCircle } from '../box/FriendBox';
import { IFriend } from '../../ultils/interface';

export interface IProps {
  onlineFriends: IFriend[] | null;
  offlineFriends: IFriend[] | null;
  avatarSize?: string;
  titleSize?: string;
  gap?: string;
  nameSize?: string;
  onlineStatusSize?: string;
}

const OnlineOfflineFriend: FC<IProps> = ({
  onlineFriends,
  offlineFriends,
  avatarSize,
  gap,
  nameSize,
  onlineStatusSize,
}) => {
  return (
    <>
      <div className={`flex flex-col ${gap ?? 'gap-3'}`}>
        {/* <h1
          className={`${
            onlineFriends && onlineFriends.length ? 'block' : 'hidden'
          } ${titleSize}`}
        >
          Online
        </h1> */}
        {onlineFriends &&
          onlineFriends.map((online) => (
            <FriendBoxCircle
              friend={online}
              className={avatarSize ?? 'w-10 h-10'}
              status={'online'}
              onlineStatus='Tired!'
              key={online._id}
            />
          ))}
      </div>
      <hr
        className={`${
          (offlineFriends && !offlineFriends.length) ||
          (onlineFriends && !onlineFriends.length && 'hidden')
        } my-4`}
      />
      <div className={`flex flex-col ${gap ?? 'gap-3'}`}>
        {/* <h1
          className={`${
            offlineFriends && offlineFriends.length ? 'block' : 'hidden'
          } ${titleSize}`}
        >
          Offline
        </h1> */}
        {offlineFriends &&
          offlineFriends.map((offline) => (
            <FriendBoxCircle
              friend={offline}
              className={avatarSize ?? 'w-10 h-10'}
              status={'offline'}
              onlineStatus='Tired!'
              key={offline._id}
              nameSize={nameSize ?? 'text-lg'}
              onlineStatusSize={onlineStatusSize ?? 'text-base'}
            />
          ))}
      </div>
    </>
  );
};

export default OnlineOfflineFriend;
