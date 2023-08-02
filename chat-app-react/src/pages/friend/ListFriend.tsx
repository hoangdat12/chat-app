import { FC, useEffect, useState } from 'react';
import FriendBox from '../../components/box/FriendBox';
import { useNavigate, useParams } from 'react-router-dom';
import { friendService } from '../../features/friend/friendService';
import { IFriend } from '../../ultils/interface';
import { getUserLocalStorageItem } from '../../ultils';

const userJson = getUserLocalStorageItem();

const ListFriend = () => {
  const { userId } = useParams();
  const [friends, setFriends] = useState<IFriend[] | null>([]);
  const [mutualFriends, setMutualFriends] = useState<IFriend[] | null>([]);

  useEffect(() => {
    if (userId) {
      // dispatch(getFriendOfUser(userId));
      const getFriendOfUser = async () => {
        const res = await friendService.getAllFriendOfUser(userId);
        const { mutualFriends, friends: friendsData } = res.data.metaData;
        setFriends(friendsData);
        setMutualFriends(mutualFriends);
      };
      getFriendOfUser();
    }
  }, [userId]);

  return (
    <div className='px-4 sm:px-6 md:px-10 xl:px-20 mt-[220px] sm:mt-[240px]'>
      {userId === userJson._id ? (
        <List friends={friends} title={'Friends'} />
      ) : (
        <>
          <List
            friends={mutualFriends}
            title={'Mutual Friends'}
            marginBottom={'mb-10'}
            className={'max-h-[320px] overflow-y-scroll'}
          />
          <List
            friends={friends}
            title={'Friends'}
            className={'max-h-[320px] overflow-y-scroll'}
          />
        </>
      )}
    </div>
  );
};

export interface IPropList {
  friends: IFriend[] | null;
  title: string;
  marginBottom?: string;
  className?: string;
}

export const List: FC<IPropList> = ({
  friends,
  marginBottom,
  title,
  className,
}) => {
  const navigate = useNavigate();
  return (
    <div className={`${marginBottom}`}>
      <h1 className='text-xl mb-3'>{title}</h1>
      <div className={`flex gap-4 border rounded-lg p-3 ${className}`}>
        {friends &&
          friends.map((friend) => (
            <div key={friend.userId} className='flex flex-col'>
              <FriendBox
                avatarUrl={friend.avatarUrl}
                userName={friend.userName}
                width={'w-16 md:w-20'}
                height={'h-16 md:h-20'}
                fontSize={'text-sm md:text-md'}
                margin={'mt-2'}
                onClick={() => navigate(`/profile/${friend.userId}`)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListFriend;
