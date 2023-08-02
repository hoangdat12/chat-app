import Layout from '../../components/layout/Layout';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import myAxios from '../../ultils/myAxios';
import { IResponse, IUser } from '../../ultils/interface';
import { getUserLocalStorageItem, getUsername } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { ICheckFriendResponse } from '../../ultils/interface/friend.interface';
import UserInformation from '../../components/user/UserInformation';
import ListFriend from '../friend/ListFriend';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { getPostOfUser, selectPost } from '../../features/post/postSlice';

import ProfileInformation from '../../components/profile/ProfileInformation';
import ProfilePost from '../../components/profile/ProfilePost';
import ProfileFriend from '../../components/profile/ProfileFriend';
import Loading from '../../components/button/Loading';

const userLocalstorage = getUserLocalStorageItem();

export enum StatusFriend {
  FRIEND = 'Friend',
  UNFRIENDED = 'Add Friend',
  CANCEL = 'Cancel',
  CONFIRM = 'Confirm',
}

export interface IFriendAndPostProp {
  userId: string | undefined;
  isOwner: boolean;
  user: IUser | null;
}

const getStatusFriend = (data: ICheckFriendResponse) => {
  const { isFriend, unFriended, confirm } = data;
  if (isFriend) return StatusFriend.FRIEND;
  else if (unFriended) return StatusFriend.UNFRIENDED;
  else if (confirm) return StatusFriend.CONFIRM;
  else return StatusFriend.CANCEL;
};

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteFriend, setShowDeleteFriend] = useState<boolean | null>(
    null
  );
  const [statusFriend, setStatusFriend] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();

  const dispatch = useAppDispatch();
  const { isLoading: loadingLoadPost } = useAppSelector(selectPost);

  // Add friend
  const handleClickAddFriend = async () => {
    if (statusFriend !== StatusFriend.FRIEND) {
      if (user) {
        const friend = {
          userId: user?._id,
          email: user?.email,
          userName: getUsername(user),
          avatarUrl: user?.avatarUrl,
        };
        const res = await friendService.addFriend(friend);
        if (res.status === 201) {
          setStatusFriend(res.data.metaData.status);
        }
      }
    } else {
      // Show delete friend
      setShowDeleteFriend(true);
    }
  };

  // Get information of user
  useEffect(() => {
    if (userId) {
      const getUserDetail = async () => {
        const res = (await myAxios.get(`/user/${userId}`)) as IResponse<IUser>;
        setUser(res.data.metaData);
        if (res.data.metaData?._id === userLocalstorage._id) {
          setIsOwner(true);
        }
      };
      const statusFriend = async () => {
        const res = await friendService.statusFriend(userId);
        if (res.status === 200) {
          const status = getStatusFriend(res.data.metaData);
          setStatusFriend(status);
        }
      };
      // Get data
      setIsLoading(true);
      getUserDetail();
      statusFriend();
      setIsLoading(false);
    }
  }, [userId, isOwner]);

  useEffect(() => {
    if (userId) {
      dispatch(getPostOfUser(userId));
    }
  }, [userId]);

  useEffect(() => {
    setIsOwner(userLocalstorage._id === userId);
  }, [userId]);

  return (
    <Layout>
      {isLoading || loadingLoadPost ? (
        <div className='flex items-center justify-center h-full w-full'>
          <Loading />
        </div>
      ) : (
        <div className='relative pb-20'>
          <div className='relative flex flex-col'>
            <UserInformation
              user={user}
              isOwner={isOwner}
              statusFriend={statusFriend}
              handleClickAddFriend={handleClickAddFriend}
              showDeleteFriend={showDeleteFriend}
              setShowDeleteFriend={setShowDeleteFriend}
            />
            <Routes>
              <Route
                path='/'
                element={
                  <FriendAndPost
                    user={user}
                    userId={userId}
                    isOwner={isOwner}
                  />
                }
              />
              <Route path='/friends' element={<ListFriend />} />
            </Routes>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const FriendAndPost: FC<IFriendAndPostProp> = memo(
  ({ userId, user, isOwner }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    return (
      <>
        <div className='mt-[200px] md:mt-[240px] lg:mt-[280px] px-3 sm:px-8 md:px-4 xl:px-32 md:grid grid-cols-3 gap-6 flex flex-col-reverse md:flex-col'>
          <ProfilePost userId={userId} user={user} />
          <div
            ref={elementRef}
            className={`md:col-span-1 flex flex-col gap-6  order-1`}
          >
            <ProfileInformation user={user} isOwner={isOwner} />
            <ProfileFriend userId={userId} />
          </div>
        </div>
      </>
    );
  }
);

export default Profile;
