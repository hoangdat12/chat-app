import { useEffect } from 'react';
import FriendBox from '../../components/box/FriendBox';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  getFriendOfUser,
  selectFriend,
} from '../../features/friend/friendSlice';

const ListFriend = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const { friends } = useAppSelector(selectFriend);
  useEffect(() => {
    dispatch(getFriendOfUser());
  }, [userId]);

  return (
    <div className='grid lg:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-4 xl:gap-6 w-4/5 mx-auto mt-[240px] sm:mt-[280px] '>
      {friends &&
        Array.from(friends.values()).map((friend) => (
          <div key={friend.userId} className='col-span-1'>
            <FriendBox
              avatarUrl={friend.avatarUrl}
              userName={friend.userName}
              // width={'w-24'}
              // height={'h-24'}
              fontSize={'text-base sm:text-xl md:text-[22px] lg:text-2xl'}
              margin={'md:mt-4 md:mb-2 mt-2'}
            />
          </div>
        ))}
    </div>
  );
};

export default ListFriend;
