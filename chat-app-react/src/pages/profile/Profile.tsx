import Layout from '../../components/layout/Layout';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { getUserLocalStorageItem } from '../../ultils';
import { friendService } from '../../features/friend/friendService';
import { ICheckFriendResponse } from '../../ultils/interface/friend.interface';
import UserInformation from '../../components/user/UserInformation';
import ListFriend from '../friend/ListFriendOfUser';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { getPostOfUser, selectPost } from '../../features/post/postSlice';

import ProfileInformation from '../../components/profile/ProfileInformation';
import ProfilePost from '../../components/profile/ProfilePost';
import ProfileFriend from '../../components/profile/ProfileFriend';
import Loading from '../../components/button/Loading';
import { profileService } from '../../features/profile/profileService';
import { IProfile } from '../../ultils/interface/profile.interface';
import { setIsError } from '../../features/showError';

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
  profile: IProfile | null;
}

const getStatusFriend = (data: ICheckFriendResponse) => {
  const { isFriend, isConfirm, isWaitConfirm } = data;
  if (isFriend) return StatusFriend.FRIEND;
  else if (isWaitConfirm) return StatusFriend.CANCEL;
  else if (isConfirm) return StatusFriend.CONFIRM;
  else return StatusFriend.UNFRIENDED;
};

const Profile = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteFriend, setShowDeleteFriend] = useState<boolean | null>(
    null
  );
  const [statusFriend, setStatusFriend] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { isLoading: loadingLoadPost } = useAppSelector(selectPost);

  const handleAddFriend = async () => {
    if (profile) {
      const res = await friendService.addFriend(profile.profile_user._id);
      if (res.status === 200 || res.status === 201) {
        setStatusFriend(StatusFriend.CANCEL);
      } else {
        dispatch(setIsError());
      }
    }
  };

  const handleCancelFriend = async () => {
    if (profile) {
      const res = await friendService.refuseFriend(profile.profile_user._id);
      if (res.status === 200 || res.status === 201) {
        setStatusFriend(StatusFriend.UNFRIENDED);
      } else {
        dispatch(setIsError());
      }
    }
  };

  const handleConfirmFriend = async () => {
    if (profile) {
      const res = await friendService.confirmFriend(profile.profile_user._id);
      if (res.status === 200 || res.status === 201) {
        setStatusFriend(StatusFriend.FRIEND);
      } else {
        dispatch(setIsError());
      }
    }
  };

  // Add friend
  const handleClick = async () => {
    switch (statusFriend) {
      case StatusFriend.FRIEND:
        setShowDeleteFriend(true);
        break;
      case StatusFriend.UNFRIENDED:
        await handleAddFriend();
        break;
      case StatusFriend.CANCEL:
        handleCancelFriend();
        break;
      case StatusFriend.CONFIRM:
        handleConfirmFriend();
        break;
      default:
        console.log('Invalid Status friend!!!');
        return;
    }
  };

  // Get information of user
  useEffect(() => {
    if (userId) {
      const getProfile = async () => {
        const res = await profileService.viewProfile(userId);
        if (res.status === 200 || res.status === 201) {
          setProfile(res.data.metaData);
        } else {
          navigate('/not-found');
        }
        if (res.data.metaData?._id === userLocalstorage._id) {
          setIsOwner(true);
        }
      };
      const statusFriend = async () => {
        if (userId !== userLocalstorage._id) {
          const res = await friendService.statusFriend(userId);
          if (res.status === 200) {
            const status = getStatusFriend(res.data.metaData);
            setStatusFriend(status);
          } else {
            dispatch(setIsError());
          }
        }
      };
      // Get data
      setIsLoading(true);
      getProfile();
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
              profile={profile}
              isOwner={isOwner}
              statusFriend={statusFriend}
              handleClickAddFriend={handleClick}
              showDeleteFriend={showDeleteFriend}
              setShowDeleteFriend={setShowDeleteFriend}
            />
            <Routes>
              <Route
                path='/'
                element={
                  <FriendAndPost
                    profile={profile}
                    userId={userId}
                    isOwner={isOwner}
                  />
                }
              />
              <Route path='/friends/*' element={<ListFriend />} />
            </Routes>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const FriendAndPost: FC<IFriendAndPostProp> = memo(
  ({ userId, profile, isOwner }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    return (
      <>
        <div className='mt-[200px] md:mt-[240px] lg:mt-[280px] px-3 sm:px-8 md:px-4 xl:px-32 md:grid grid-cols-3 gap-6 flex flex-col-reverse md:flex-col'>
          <ProfilePost userId={userId} profile={profile} />
          <div
            ref={elementRef}
            className={`md:col-span-1 flex flex-col gap-6  order-1`}
          >
            <ProfileInformation profile={profile} isOwner={isOwner} />
            <ProfileFriend userId={userId} />
          </div>
        </div>
      </>
    );
  }
);

export default Profile;
