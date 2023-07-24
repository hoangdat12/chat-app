import FriendBox from '../../components/box/FriendBox';
import Button from '../../components/button/Button';
import Layout from '../../components/layout/Layout';
import { FC, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import myAxios from '../../ultils/myAxios';
import { IResponse, IUser } from '../../ultils/interface';
import { getUserLocalStorageItem, getUsername } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { ICheckFriendResponse } from '../../ultils/interface/friend.interface';
import UserInformation from '../../components/user/UserInformation';
import ListFriend from '../friend/ListFriend';
import { useAppDispatch } from '../../app/hook';
import { getPostOfUser } from '../../features/post/postSlice';
import ListFeed from '../../components/feed/ListFeed';

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
                element={<FriendAndPost userId={userId} isOwner={isOwner} />}
              />
              <Route path='/friends' element={<ListFriend />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export enum modeViewProfilePost {
  FEEDS = 'Feeds',
  SAVES = 'Save',
}

export const FriendAndPost: FC<IFriendAndPostProp> = ({ userId }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState('Feeds');

  const handleClickModeView = (mode: string) => {
    setActive(mode);
  };

  return (
    <>
      <div className='mt-[200px] md:mt-[240px] lg:mt-[280px] md:px-4 xl:px-12 md:grid grid-cols-3 '>
        <div className='mt-4 lg:mt-0 py-4 px-4 md:col-span-2'>
          <div className='flex gap-4 items-end'>
            {(
              Object.keys(
                modeViewProfilePost
              ) as (keyof typeof modeViewProfilePost)[]
            ).map((mode) => (
              <h1
                onClick={() => handleClickModeView(modeViewProfilePost[mode])}
                key={mode}
                className={`${
                  active === modeViewProfilePost[mode]
                    ? 'text-xl md:text-2xl xl:text-3xl font-medium'
                    : 'text-base md:text-md xl:text-lg'
                } cursor-pointer`}
              >
                {modeViewProfilePost[mode]}
              </h1>
            ))}
          </div>
          <ListFeed />
        </div>
        <div className='md:col-span-1 py-4 px-4'>
          <h1 className='text-xl md:text-2xl xl:text-3xl font-medium'>
            Friends
          </h1>
          <div className='grid grid-cols-12 mt-4 gap-2'>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className='col-span-4 md:col-span-3 lg:col-span-4'
              >
                <FriendBox
                  avatarUrl={
                    'https://flowbite.com/application-ui/demo/images/users/jese-leos-2x.png'
                  }
                  userName={'Hoang Dat'}
                />
              </div>
            ))}
          </div>
          <div
            onClick={() => navigate(`/profile/${userId}/friends`)}
            className='flex items-center justify-center mt-4'
          >
            <Button text={'Show more'} border={'border-none'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
