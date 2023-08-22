import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import FriendBox from '../../components/box/FriendBox';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { friendService } from '../../features/friend/friendService';
import { IFriend } from '../../ultils/interface';
import { getUserLocalStorageItem } from '../../ultils';
import Avatar from '../../components/avatars/Avatar';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/Ai';
import Loading from '../../components/button/Loading';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';

const userJson = getUserLocalStorageItem();

export interface IPropListFriends {
  friends: IFriend[] | null;
  isLoading: boolean;
}

export interface IPropListFriendsV2 extends IPropListFriends {
  type: string;
  setFriends: Dispatch<SetStateAction<IFriend[] | null>>;
}

const listProfile = [
  {
    title: 'Friends',
    path: (userId: string | undefined) => `/profile/${userId}/friends`,
  },
  {
    title: 'Request',
    path: (userId: string | undefined) => `/profile/${userId}/friends/request`,
  },
  {
    title: 'Pending',
    path: (userId: string | undefined) => `/profile/${userId}/friends/pending`,
  },
];

const listProfileFriend = [
  {
    title: 'Friends',
    path: (userId: string | undefined) => `/profile/${userId}/friends`,
  },
  {
    title: 'Mutuals',
    path: (userId: string | undefined) => `/profile/${userId}/friends/mutuals`,
  },
];

const ListFriend = () => {
  const { userId } = useParams();
  const { pathname } = useLocation();
  const [friends, setFriends] = useState<IFriend[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      const getFriends = async () => {
        setIsLoading(true);
        let res = null;
        switch (pathname) {
          case `/profile/${userId}/friends`:
            res = await friendService.getFriendOfUser(userId);
            break;
          case `/profile/${userId}/friends/request`:
            res = await friendService.getListRequestAddFriend();
            break;
          case `/profile/${userId}/friends/pending`:
            res = await friendService.getListPendingAddFriend();
            break;
          default:
            console.log('Invalid!!!!');
            break;
        }
        if (res?.status === 200) {
          setFriends(res.data.metaData);
        } else {
          setFriends(null);
        }
        setIsLoading(false);
      };
      getFriends();
    }
  }, [userId, pathname]);

  return (
    <div className='px-4 sm:px-6 md:px-10 xl:px-20 mt-[220px] sm:mt-[240px]'>
      <ul className='flex items-center gap-2 mb-6'>
        {userId !== userJson._id
          ? listProfileFriend.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={`${item.path(userId)}`}
                  className={`text-lg px-6 py-2 rounded-lg ${
                    pathname === item.path(userId)
                      ? 'bg-blue-500 text-white'
                      : ''
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))
          : listProfile.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={`${item.path(userId)}`}
                  className={`text-lg px-6 py-2 rounded-lg ${
                    pathname === item.path(userId)
                      ? 'bg-blue-500 text-white'
                      : ''
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
      </ul>
      {userId !== userJson._id ? (
        <div className={`flex gap-4 border rounded-lg p-3`}>
          <ListFriends friends={friends} isLoading={isLoading} />
        </div>
      ) : (
        <div>
          <div className={`flex gap-4 border rounded-lg p-3`}>
            <Routes>
              <Route
                path='/'
                element={
                  <ListFriends friends={friends} isLoading={isLoading} />
                }
              />
              <Route
                path='/request'
                element={
                  <ListFriendsV2
                    friends={friends}
                    type={'request'}
                    isLoading={isLoading}
                    setFriends={setFriends}
                  />
                }
              />
              <Route
                path='/pending'
                element={
                  <ListFriendsV2
                    friends={friends}
                    type={'pending'}
                    isLoading={isLoading}
                    setFriends={setFriends}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export const ListFriends: FC<IPropListFriends> = ({ friends, isLoading }) => {
  const navigate = useNavigate();

  return isLoading ? (
    <div className='flex items-center justify-center w-full p-10'>
      <Loading />
    </div>
  ) : (
    <>
      {friends && friends?.length ? (
        friends?.map((friend) => (
          <div key={friend._id} className='flex flex-col'>
            <FriendBox
              friend={friend}
              width={'w-16 md:w-20'}
              height={'h-16 md:h-20'}
              fontSize={'text-sm md:text-md'}
              margin={'mt-2'}
              onClick={() => navigate(`/profile/${friend._id}`)}
            />
          </div>
        ))
      ) : (
        <div className='flex items-center justify-center w-full p-10'>
          Don't have friends
        </div>
      )}
    </>
  );
};

export const ListFriendsV2: FC<IPropListFriendsV2> = ({
  friends,
  type,
  isLoading,
  setFriends,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRefuseRequestAddFriend = async (friendId: string) => {
    const res = await friendService.refuseFriend(friendId);
    if (res.status === 200 || res.status === 201) {
      setFriends((prev) =>
        prev ? prev?.filter((friend) => friend._id !== friendId) : null
      );
    } else {
      dispatch(setIsError());
    }
  };

  const handleConfirmRequestAddFriend = async (friendId: string) => {
    const res = await friendService.confirmFriend(friendId);
    if (res.status === 200 || res.status === 201) {
      setFriends((prev) =>
        prev ? prev?.filter((friend) => friend._id !== friendId) : null
      );
    } else {
      dispatch(setIsError());
    }
  };

  return isLoading ? (
    <div className='flex items-center justify-center w-full p-10'>
      <Loading />
    </div>
  ) : (
    <div className='grid grid-cols-2 gap-6 w-full'>
      {friends && friends.length ? (
        friends.map((friend) => (
          <div
            key={friend._id}
            className='col-span-2 md:col-span-1 flex items-center justify-between'
          >
            <div
              onClick={() => navigate(`/profile/${friend._id}`)}
              className='flex items-center gap-2'
            >
              <Avatar
                avatarUrl={friend.avatarUrl}
                className={`w-14 h-14 min-h-[3.5rem] min-w-[3.5rem] md:w-18 md:h-18`}
              />
              <div>
                <h1 className={`text-sm md:text-lg`}>{friend.userName}</h1>
                <h1 className={`text-xs md:text-sm text-gray-600`}>
                  {'Student'}
                </h1>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {type === 'request' && (
                <span
                  onClick={() => handleConfirmRequestAddFriend(friend._id)}
                  className='flex p-2 text-sm md:text-base rounded-full bg-gray-100 hover:bg-gray-200 duration-300 cursor-pointer'
                >
                  <AiOutlineCheck />
                </span>
              )}
              <span
                onClick={() => handleRefuseRequestAddFriend(friend._id)}
                className='flex p-2 text-sm md:text-base  rounded-full bg-gray-100 hover:bg-gray-200 duration-300 cursor-pointer'
              >
                <AiOutlineClose />
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className='flex items-center justify-center col-span-2 p-10'>{`Don't have ${type}`}</div>
      )}
    </div>
  );
};

export default ListFriend;
