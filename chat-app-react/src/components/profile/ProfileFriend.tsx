import Avatar from '../avatars/Avatar';
import { BsPersonPlusFill } from 'react-icons/bs';
import Button from '../button/Button';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  getFriendOfUser,
  selectFriend,
} from '../../features/friend/friendSlice';
import { IFriend } from '../../ultils/interface';

export interface IPropProfileFriend {
  userId: string | undefined;
}

const ProfileFriend: FC<IPropProfileFriend> = ({ userId }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { friends, mutualFriends } = useAppSelector(selectFriend);

  useEffect(() => {
    if (userId) {
      dispatch(getFriendOfUser(userId));
    }
  }, [userId]);

  return (
    <div className='p-4 rounded-md bg-gray-100'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg md:text-xl xl:text-2xl font-medium'>Friends</h1>
        <span
          className={`${
            !mutualFriends && 'hidden'
          } text-sm text-gray-700 cursor-pointer`}
        >{`${mutualFriends} Mutual`}</span>
      </div>
      <div className='flex flex-col gap-3'>
        {friends &&
          Array.from(friends.values()).map((friend) => (
            <FriendBoxDetail key={friend.userId} friend={friend} />
          ))}
      </div>
      <div
        onClick={() => navigate(`/profile/${userId}/friends`)}
        className='flex items-center justify-center mt-4'
      >
        <Button text={'Show more'} border={'border-none'} />
      </div>
    </div>
  );
};

export interface IPropFriendBoxDetial {
  friend: IFriend;
}

export const FriendBoxDetail: FC<IPropFriendBoxDetial> = ({ friend }) => {
  return (
    <div className='flex items-center justify-between mt-4'>
      <div className='flex items-center gap-2'>
        <Avatar avatarUrl={friend.avatarUrl} className='w-12 h-12' />
        <div className='flex flex-col'>
          <span className='cursor-pointer'>{friend.userName}</span>
          <span className='text-sm text-gray-700'>22th Birthday</span>
        </div>
      </div>
      <span className='cursor-pointer'>
        <BsPersonPlusFill />
      </span>
    </div>
  );
};

export default ProfileFriend;
