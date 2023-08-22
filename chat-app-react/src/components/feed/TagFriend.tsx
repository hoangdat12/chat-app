import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import SearchBox from '../search/SearchBox';
import { GrAddCircle } from 'react-icons/gr';
import { AiOutlineMinusCircle } from 'react-icons/Ai';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  getFriendOfUser,
  selectFriend,
} from '../../features/friend/friendSlice';
import { FriendBoxCircle } from '../box/FriendBox';
import { IFriend } from '../../ultils/interface';
import useDebounce from '../../hooks/useDebounce';
import { friendService } from '../../features/friend/friendService';
import useClickOutside from '../../hooks/useClickOutside';
import Loading from '../button/Loading';
import { getUserLocalStorageItem } from '../../ultils';
import { setIsError } from '../../features/showError';

export interface IPropTagFriend {
  friend: IFriend;
  setListFriendTag: Dispatch<SetStateAction<IFriend[]>>;
}

export interface IPropTagFriendModel {
  setListFriendTag: Dispatch<SetStateAction<IFriend[]>>;
  setShowTagFriend: (value: boolean) => void;
}

const user = getUserLocalStorageItem();

const TagFriendModel: FC<IPropTagFriendModel> = ({
  setListFriendTag,
  setShowTagFriend,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchFriends, setSearchFriends] = useState<IFriend[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modelRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const { friends, isLoading: isLoadingGetFriend } =
    useAppSelector(selectFriend);
  const debounceValue = useDebounce(searchValue, 600);

  useClickOutside(modelRef, () => setShowTagFriend(false), 'mousedown');

  useEffect(() => {
    if (!friends) {
      dispatch(getFriendOfUser(user._id));
    }
  }, []);

  useEffect(() => {
    const handleSearchFriend = async () => {
      setIsLoading(true);
      const res = await friendService.searchFriendByUserName(debounceValue);
      if (res.status === 200) {
        setSearchFriends(res.data.metaData.friends);
      } else {
        dispatch(setIsError());
      }
      setIsLoading(false);
    };
    if (debounceValue.trim() !== '') {
      handleSearchFriend();
    }
  }, [debounceValue]);

  return (
    <div
      ref={modelRef}
      className='absolute bottom-10 left-50% -translate-x-1/2 w-[360px] h-[300px] bg-white shadow-default p-3 animate__animated animate__zoomIn'
    >
      <SearchBox
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSearchData={setSearchFriends}
      />
      <div className='mt-4 flex flex-col gap-3 h-[230px]'>
        {searchValue === '' ? (
          isLoadingGetFriend ? (
            <div className='flex items-center justify-center w-full h-full'>
              <Loading />
            </div>
          ) : (
            friends &&
            Array.from(friends.values()).map((friend) => (
              <TagFriend
                key={friend._id}
                friend={friend}
                setListFriendTag={setListFriendTag}
              />
            ))
          )
        ) : isLoading ? (
          <div className='flex items-center justify-center w-full h-full'>
            <Loading />
          </div>
        ) : (
          searchFriends &&
          searchFriends.map((friend) => (
            <TagFriend
              key={friend._id}
              friend={friend}
              setListFriendTag={setListFriendTag}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const TagFriend: FC<IPropTagFriend> = ({ friend, setListFriendTag }) => {
  const [add, setAdd] = useState(false);

  const handleAddUser = () => {
    if (!add) {
      setListFriendTag((prevs) => [...prevs, friend]);
    } else {
      setListFriendTag((prevs) =>
        prevs.filter((prev) => prev._id !== friend._id)
      );
    }
    setAdd(!add);
  };

  return (
    <div key={friend._id} className='flex justify-between items-center'>
      <FriendBoxCircle
        friend={friend}
        className={'w-10 h-10'}
        status={'online'}
      />
      <div onClick={handleAddUser} className='cursor-pointer p-2'>
        {add ? <AiOutlineMinusCircle /> : <GrAddCircle />}
      </div>
    </div>
  );
};

export default TagFriendModel;
