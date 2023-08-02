import Avatar from '../avatars/Avatar';
import { BsFillPersonCheckFill, BsPersonPlusFill } from 'react-icons/bs';
import Button from '../button/Button';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  getFriendOfUser,
  selectFriend,
} from '../../features/friend/friendSlice';
import { IFriend } from '../../ultils/interface';
import { getUserLocalStorageItem } from '../../ultils';

export interface IPropProfileFriend {
  userId: string | undefined;
}

const userJson = getUserLocalStorageItem();

const ProfileFriend: FC<IPropProfileFriend> = ({ userId }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { friends, mutualFriends } = useAppSelector(selectFriend);
  const condition =
    friends &&
    friends.size !== 0 &&
    !(friends.size === 1 && friends.has(userJson._id));
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
      <div className='flex flex-col-reverse gap-3'>
        {condition ? (
          Array.from(friends.values()).map((friend: IFriend) => {
            if (friend.userId === userJson._id) return;
            else return <FriendBoxDetail key={friend.userId} friend={friend} />;
          })
        ) : (
          <div className='flex items-center justify-center min-h-[100px]'>
            <h1>Not have friends</h1>
          </div>
        )}
      </div>
      <div
        onClick={() => navigate(`/profile/${userId}/friends`)}
        className={`${
          condition ? 'flex' : 'hidden'
        } items-center justify-center mt-4`}
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
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/profile/${friend.userId}`);
  };

  return (
    <div className='flex items-center justify-between mt-4'>
      <div className='flex items-center gap-2'>
        <Avatar
          onClick={handleNavigate}
          avatarUrl={friend.avatarUrl}
          className='w-12 h-12'
        />
        <div className='flex flex-col'>
          <span onClick={handleNavigate} className='cursor-pointer'>
            {friend.userName}
          </span>
          <span className='text-sm text-gray-700'>22th Birthday</span>
        </div>
      </div>
      <span onClick={handleNavigate} className='cursor-pointer'>
        {friend?.isFriend ? <BsFillPersonCheckFill /> : <BsPersonPlusFill />}
      </span>
    </div>
  );
};

export default ProfileFriend;
