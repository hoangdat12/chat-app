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
import { useAppDispatch } from '../../app/hook';
import { getPostOfUser } from '../../features/post/postSlice';

import ProfileInformation from '../../components/profile/ProfileInformation';
import ProfilePost from '../../components/profile/ProfilePost';
import ProfileFriend from '../../components/profile/ProfileFriend';

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
  const [statusFriend, setStatusFriend] = useState('');
  const { userId } = useParams();

  const dispatch = useAppDispatch();

  // Add friend
  const handleClickAddFriend = async () => {
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

      getUserDetail();
    }
  }, [userId]);

  // Get status friend
  useEffect(() => {
    if (userId) {
      const statusFriend = async () => {
        const res = await friendService.statusFriend(userId);
        if (res.status === 200) {
          const status = getStatusFriend(res.data.metaData);
          setStatusFriend(status);
        }
      };

      statusFriend();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getPostOfUser(userId));
    }
  }, [userId]);

  return (
    <Layout>
      <div className='relative justify-center items-center pb-20'>
        <div className='flex flex-col'>
          <div className='relative flex flex-col'>
            <UserInformation
              user={user}
              isOwner={isOwner}
              statusFriend={statusFriend}
              handleClickAddFriend={handleClickAddFriend}
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
      </div>
    </Layout>
  );
};

export const FriendAndPost: FC<IFriendAndPostProp> = memo(
  ({ userId, user }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    return (
      <>
        <div className='mt-[200px] md:mt-[240px] lg:mt-[280px] px-8 md:px-4 xl:px-32 md:grid grid-cols-3 gap-6 flex flex-col-reverse md:flex-col'>
          <ProfilePost userId={userId} user={user} />
          <div
            ref={elementRef}
            className={`md:col-span-1 flex flex-col gap-6  order-1`}
          >
            <ProfileInformation user={user} />
            <ProfileFriend userId={userId} />
          </div>
        </div>
      </>
    );
  }
);

export default Profile;
