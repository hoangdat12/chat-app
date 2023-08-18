import { memo, useEffect, useState } from 'react';
import { getUserLocalStorageItem } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { IFriend } from '../../ultils/interface';
import { FriendBoxCircle } from '../box/FriendBox';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/Ai';
import useDebounce from '../../hooks/useDebounce';

const userLocal = getUserLocalStorageItem();

const ListFriendOfUser = memo(() => {
  const [onlineFriends, setOnlineFriends] = useState<IFriend[] | null>(null);
  const [offlineFriends, setOfflineFriends] = useState<IFriend[] | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResultOnline, setSearchResultOnline] = useState<
    IFriend[] | null
  >(null);
  const [searchResultOffline, setSearchResultOffline] = useState<
    IFriend[] | null
  >(null);

  const debounceValue = useDebounce(searchValue);

  const handleClearSearchValue = () => {
    setSearchValue('');
    setSearchResultOnline(null);
    setSearchResultOffline(null);
  };

  useEffect(() => {
    const handleSearchFriend = async () => {
      if (searchValue.trim() !== '') {
        console.log('search');
        const res = await friendService.searchFriendOnlOffByUserName(
          searchValue.trim()
        );
        if (res.status === 200) {
          setSearchResultOnline(res.data.metaData.onlineFriends);
          setSearchResultOffline(res.data.metaData.offlineFriends);
        }
      }
    };
    handleSearchFriend();
  }, [debounceValue]);

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
    <div className='flex flex-col bg-gray-100 p-3 rounded-md'>
      <div className='flex gap-2 items-center'>
        <div className='flex items-center gap-2 w-full bg-white pl-3 pr-2 rounded-md'>
          <div className='flex gap-2 items-center w-full'>
            <input
              className='outline-none text-sm py-1 rounded w-full bg-transparent'
              type='text'
              value={searchValue}
              onChange={(e: any) => setSearchValue(e.target.value)}
              placeholder='Search...'
            />
            {searchValue !== '' && (
              <span
                onClick={handleClearSearchValue}
                className='text-xs cursor-pointer'
              >
                <AiOutlineClose />
              </span>
            )}
          </div>
          <span className='text-lg'>
            <AiOutlineSearch />
          </span>
        </div>
      </div>

      <div className='mt-4'>
        {debounceValue !== '' ? (
          <div className='flex flex-col gap-4'>
            {searchResultOnline &&
              searchResultOnline.map((online) => (
                <FriendBoxCircle
                  friend={online}
                  className='w-10 h-10'
                  status={'online'}
                  onlineStatus='Tired!'
                  key={online._id}
                />
              ))}

            {searchResultOffline &&
              searchResultOffline.map((offline) => (
                <FriendBoxCircle
                  friend={offline}
                  className='w-10 h-10'
                  status={'online'}
                  onlineStatus='Tired!'
                  key={offline._id}
                />
              ))}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
});

export default ListFriendOfUser;
