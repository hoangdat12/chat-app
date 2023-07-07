import FriendBox from '../../components/box/FriendBox';
import Button from '../../components/button/Button';
import Feed from '../../components/feed/Feed';
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

export const FriendAndPost: FC<IFriendAndPostProp> = ({ userId, isOwner }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className='mt-[200px] md:mt-[240px] lg:mt-[280px] md:px-4 xl:px-12 lg:grid grid-cols-3 lg:gap-6'>
        <div className='p-4 lg:col-span-1 '>
          <h1 className='text-xl lg:text-3xl font-medium'>Friends</h1>
          <div className='grid grid-cols-12 mt-4 lg:mt-10 gap-2 md:gap-4'>
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

        <div className='mt-6 lg:mt-0 p-4 lg:col-span-2 '>
          <h1 className='text-xl lg:text-3xl font-medium'>Feeds</h1>
          <div className='mt-6 lg:mt-10'>
            <Feed isOwner={isOwner} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
