import Avatar from '../avatars/Avatar';
import { BsFillPersonCheckFill, BsPersonPlusFill } from 'react-icons/bs';
import Button from '../button/Button';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IFriend } from '../../ultils/interface';
import { getUserLocalStorageItem } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { useAppDispatch } from '../../app/hook';
import { setIsError } from '../../features/showError';

export interface IPropProfileFriend {
  userId: string | undefined;
}

const userJson = getUserLocalStorageItem();

const ProfileFriend: FC<IPropProfileFriend> = ({ userId }) => {
  const [friends, setFriends] = useState<IFriend[] | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getFriends = async () => {
      if (userId) {
        const res = await friendService.getFriendOfUser(userId);
        if (res.status === 200) {
          setFriends(res.data.metaData);
        } else {
          // Handle Error
          setFriends(null);
          dispatch(setIsError());
        }
      }
    };
    getFriends();
  }, [userId]);

  return (
    <div className='p-4 rounded-md bg-gray-100'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg md:text-xl xl:text-2xl font-medium'>Friends</h1>
        {/* <span
          className={`${
            !mutualFriends && 'hidden'
          } text-sm text-gray-700 cursor-pointer`}
        >{`${mutualFriends} Mutual`}</span> */}
      </div>
      <div className='flex flex-col-reverse gap-3'>
        {friends && friends.length ? (
          Array.from(friends.values()).map((friend: IFriend) => {
            if (friend._id !== userJson._id)
              return <FriendBoxDetail key={friend._id} friend={friend} />;
          })
        ) : (
          <div className='flex items-center justify-center min-h-[100px]'>
            <h1>Not have friends</h1>
          </div>
        )}
      </div>
      <div
        onClick={() =>
          navigate(`/profile/${userId}/friends`, { preventScrollReset: true })
        }
        className={`${
          friends && friends.length ? 'flex' : 'hidden'
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
    navigate(`/profile/${friend._id}`, { preventScrollReset: true });
  };

  return (
    <div className='flex items-center justify-between mt-4'>
      <div className='flex items-center gap-2'>
        <Avatar
          onClick={handleNavigate}
          avatarUrl={friend.avatarUrl}
          className='w-12 h-12 min-h-[3rem] min-w-[3rem]'
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
