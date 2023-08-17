import { memo, useEffect, useState } from 'react';
import { getUserLocalStorageItem } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { IFriend } from '../../ultils/interface';
import { FriendBoxCircle } from '../box/FriendBox';

const userLocal = getUserLocalStorageItem();

const ListFriendOfUser = memo(() => {
  const [onlineFriends, setOnlineFriends] = useState<IFriend[] | null>(null);
  const [offlineFriends, setOfflineFriends] = useState<IFriend[] | null>(null);

  useEffect(() => {
    const handleGetFriendOfUser = async () => {
      const res = await friendService.findFriendOnlineAndOffline(userLocal._id);
      if (res.status === 200 || res.status === 201) {
        setOnlineFriends(res.data.metaData.onlineFriends);
        setOfflineFriends(res.data.metaData.offlineFriends);
      }
    };

    handleGetFriendOfUser();
  }, [userLocal]);

  return (
    <div className='mt-4'>
      <div className='flex flex-col gap-4'>
        <h1
          className={`${
            onlineFriends && onlineFriends.length ? 'block' : 'hidden'
          }`}
        >
          Online
        </h1>
        {onlineFriends &&
          onlineFriends.map((online) => (
            <FriendBoxCircle
              friend={online}
              className='w-10 h-10'
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
      <div className='flex flex-col gap-3'>
        <h1
          className={`${
            offlineFriends && offlineFriends.length ? 'block' : 'hidden'
          }`}
        >
          Offline
        </h1>
        {offlineFriends &&
          offlineFriends.map((offline) => (
            <FriendBoxCircle
              friend={offline}
              className='w-10 h-10'
              status={'offline'}
              onlineStatus='Tired!'
              key={offline._id}
            />
          ))}
      </div>
    </div>
  );
});

export default ListFriendOfUser;
