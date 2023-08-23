import { memo, useEffect, useState } from 'react';
import { getUserLocalStorageItem } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { IConversation, IFriend } from '../../ultils/interface';
import { FriendBoxCircle } from '../box/FriendBox';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/Ai';
import useDebounce from '../../hooks/useDebounce';
import OnlineOfflineFriend from './OnlineOfflineFriend';
import { conversationService } from '../../features/conversation/conversationService';
import Avatar from '../avatars/Avatar';
import { useNavigate } from 'react-router-dom';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';

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
  const [typeList, setTypeList] = useState('friend');
  const [groups, setGroups] = useState<IConversation[] | null>(null);
  const [searchGroupResult, setSearchGroupResult] = useState<
    IConversation[] | null
  >(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const debounceValue = useDebounce(searchValue);

  const handleClearSearchValue = () => {
    setSearchValue('');
    setSearchResultOnline(null);
    setSearchResultOffline(null);
  };

  const handleSwitchList = (type: string) => {
    setTypeList(type);
  };

  useEffect(() => {
    const handleSearchFriend = async () => {
      if (searchValue.trim() !== '') {
        const res = await friendService.searchFriendOnlOffByUserName(
          searchValue.trim()
        );
        if (res.status === 200) {
          setSearchResultOnline(res.data.metaData.onlineFriends);
          setSearchResultOffline(res.data.metaData.offlineFriends);
        } else {
          dispatch(setIsError());
        }
      }
    };

    const handleSearchGroup = async () => {
      if (searchValue.trim() !== '') {
        const res = await conversationService.findGroupByKeyword(
          userLocal._id,
          searchValue.trim()
        );
        if (res.status === 200 || res.status === 201) {
          setSearchGroupResult(res.data.metaData);
        } else {
          dispatch(setIsError());
        }
      }
    };

    if (typeList === 'friend') {
      handleSearchFriend();
    } else if (typeList === 'group') {
      handleSearchGroup();
    }
  }, [debounceValue, typeList]);

  useEffect(() => {
    const handleGetFriendOfUser = async () => {
      if (!onlineFriends || !offlineFriends) {
        const res = await friendService.findFriendOnlineAndOffline(
          userLocal._id
        );
        if (res.status === 200 || res.status === 201) {
          setOnlineFriends(res.data.metaData.onlineFriends);
          setOfflineFriends(res.data.metaData.offlineFriends);
        } else {
          dispatch(setIsError());
        }
      }
    };

    const handleGetGroup = async () => {
      if (!groups) {
        const res = await conversationService.getAllGroupOfUser(userLocal._id);
        if (res.status === 200 || res.status === 201) {
          setGroups(res.data.metaData);
        } else {
          dispatch(setIsError());
        }
      }
    };

    if (typeList === 'friend') {
      handleGetFriendOfUser();
    } else if (typeList === 'group') {
      handleGetGroup();
    }
  }, [userLocal, typeList]);

  return (
    <div className='flex flex-col bg-gray-100 p-3 rounded-md shadow-box'>
      <div className='flex gap-3'>
        <span
          onClick={() => handleSwitchList('friend')}
          className={`${
            typeList === 'friend' && 'bg-blue-500 text-white'
          } px-2 py-1 rounded cursor-pointer`}
        >
          Friends
        </span>
        <span
          onClick={() => handleSwitchList('group')}
          className={`${
            typeList === 'group' && 'bg-blue-500 text-white'
          } px-2 py-1 rounded cursor-pointer`}
        >
          Group
        </span>
      </div>

      <div className='flex gap-2 items-center mt-4'>
        <div className='flex items-center gap-2 w-full bg-white pl-3 pr-2 rounded-md'>
          <div className='flex gap-2 items-center w-full'>
            <input
              className='outline-none py-1 px-1 rounded w-full bg-transparent'
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
        {typeList === 'friend' ? (
          <div>
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
              <OnlineOfflineFriend
                onlineFriends={onlineFriends}
                offlineFriends={offlineFriends}
                nameSize='text-sm'
                onlineStatusSize='text-xs'
              />
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {debounceValue !== ''
              ? searchGroupResult &&
                searchGroupResult.map((result) => (
                  <div
                    key={result._id}
                    onClick={() => navigate(`/conversation/${result._id}`)}
                    className='flex gap-2 items-center cursor-pointer'
                  >
                    <Avatar
                      avatarUrl={result.avatarUrl}
                      className={'w-12 h-12 max-w-[3rem] max-h-[3rem]'}
                    />
                    <div>
                      <h1 className={'text-sm'}>{result.nameGroup}</h1>
                      <p className='text-xs text-gray-500'>Chat now!!!</p>
                    </div>
                  </div>
                ))
              : groups &&
                groups?.map((group) => (
                  <div
                    key={group._id}
                    onClick={() => navigate(`/conversation/${group._id}`)}
                    className='flex gap-2 items-center cursor-pointer'
                  >
                    <Avatar
                      avatarUrl={group.avatarUrl}
                      className={'w-12 h-12 max-w-[3rem] max-h-[3rem]'}
                    />
                    <div>
                      <h1 className={'text-sm'}>{group.nameGroup}</h1>
                      <p className='text-xs text-gray-500'>Chat now!!!</p>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ListFriendOfUser;
