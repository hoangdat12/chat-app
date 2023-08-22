import { memo, useEffect, useState } from 'react';
import Button from '../button/Button';
import { getUserLocalStorageItem } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { IFriend } from '../../ultils/interface';
import OnlineOfflineFriend from '../friend/OnlineOfflineFriend';
import { useAppDispatch } from '../../app/hook';
import { setIsError } from '../../features/showError';

const userLocal = getUserLocalStorageItem();

const NoConversation = memo(() => {
  const [showListFriend, setShowListFriend] = useState(false);
  const [onlineFriends, setOnlineFriends] = useState<IFriend[] | null>(null);
  const [offlineFriends, setOfflineFriends] = useState<IFriend[] | null>(null);
  const dispatch = useAppDispatch();

  const handleShowListFriend = () => {
    setShowListFriend(true);
  };

  useEffect(() => {
    const getFriends = async () => {
      const res = await friendService.findFriendOnlineAndOffline(userLocal._id);
      if (res.status === 200 || res.status === 201) {
        setOnlineFriends(res.data.metaData.onlineFriends);
        setOfflineFriends(res.data.metaData.offlineFriends);
      } else {
        dispatch(setIsError());
      }
    };

    getFriends();
  }, [userLocal]);

  return (
    <div className='w-full h-full flex items-center justify-center py-10'>
      {showListFriend ? (
        <div className='w-2/5 h-full'>
          <OnlineOfflineFriend
            onlineFriends={onlineFriends}
            offlineFriends={offlineFriends}
            avatarSize='w-14 h-14'
            titleSize='text-2xl'
            gap='gap-4'
          />
        </div>
      ) : (
        <Button
          onClick={handleShowListFriend}
          text={'Start chat now'}
          className='border-none bg-blue-500 text-white px-5 py-2 hover:bg-blue-700 duration-300'
          textSize='text-xl'
        />
      )}
    </div>
  );
});

export default NoConversation;
