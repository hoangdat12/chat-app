import { FC, memo, useEffect, useRef, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import {
  convertUserToParticipant,
  getUserLocalStorageItem,
  getUsername,
} from '../../ultils';
import Button from '../button/Button';
import { StatusFriend } from '../../pages/profile/Profile';
import { FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { RiUserSharedLine } from 'react-icons/ri';
import { friendService } from '../../features/friend/friendService';
import useClickOutside from '../../hooks/useClickOutside';
import { useNavigate } from 'react-router-dom';
import { IProfile } from '../../ultils/interface/profile.interface';
import { conversationService } from '../../features/conversation/conversationService';
import { IConversation } from '../../ultils/interface';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';

export interface IUserInformationProp {
  profile: IProfile | null;
  isOwner: boolean;
  statusFriend: string;
  handleClickAddFriend?: () => void;
  showDeleteFriend: boolean | null;
  setShowDeleteFriend: (value: boolean) => void;
}

const userLocal = getUserLocalStorageItem();

const UserInformation: FC<IUserInformationProp> = memo(
  ({
    profile,
    isOwner,
    statusFriend,
    handleClickAddFriend,
    showDeleteFriend,
    setShowDeleteFriend,
  }) => {
    const [file, setFile] = useState<File | null>(null);

    const navigate = useNavigate();
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const handleUnFriend = async () => {
      if (profile) {
        const res = await friendService.deleteFriend(
          profile?.profile_user?._id
        );
        if (res.status === 200 || res.status === 201) {
          setShowDeleteFriend(false);
        } else {
          dispatch(setIsError());
        }
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFile(file);
      }
    };

    const handleClickButton2 = async () => {
      if (isOwner) {
        navigate('/setting');
      } else {
        if (statusFriend === StatusFriend.FRIEND) {
          const res = await conversationService.findMatchConversation(
            profile?.profile_user._id
          );
          if (res.status === 200) {
            const foundConversation = res.data.metaData;
            if (foundConversation) {
              navigate(`/conversation/${foundConversation._id}`);
            } else {
              if (profile) {
                const fakeConversation: IConversation = {
                  _id: profile?.profile_user._id,
                  conversation_type: 'conversation',
                  participants: [
                    convertUserToParticipant(profile.profile_user),
                    convertUserToParticipant(userLocal),
                  ],
                  lastMessage: undefined,
                  updatedAt: new Date().toString(),
                  createdAt: new Date().toString(),
                  nameGroup: undefined,
                  userId: [],
                  avatarUrl: '',
                  collection: '',
                };
                navigate(`/conversation/${profile?.profile_user._id}`, {
                  state: { fakeConversation },
                  replace: true,
                });
              }
            }
          } else {
            dispatch(setIsError());
          }
        } else {
          // Follow
        }
      }
    };

    useClickOutside(buttonRef, () => setShowDeleteFriend(false), 'mousedown');

    useEffect(() => {
      if (file) {
        navigate('/crop/avatar', { state: { file } });
      }
    }, [file]);

    return (
      <div className='relative h-[280px] sm:h-[360px]'>
        <img
          className='w-full h-full shadow-lg object-cover'
          src={profile?.profile_banner}
          alt='user-pic'
        />
        {isOwner && (
          <div className='absolute top-4 left-4 p-2 rounded-full bg-gray-50 cursor-pointer sm:text-xl md:text-3xl'>
            <CiEdit />
          </div>
        )}
        <div className='absolute top-1/2 left-[50%] -translate-x-1/2 translate-y-[40%] flex flex-col items-center justify-center'>
          <div className='relative'>
            <img
              className='w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-full border-2 border-pink-600 p-[1px] cursor-pointer'
              src={profile?.profile_user?.avatarUrl}
              alt='user-pic'
            />
            {isOwner && (
              <div className='absolute bottom-2 right-1 p-2 rounded-full bg-gray-100 cursor-pointer sm:text-lg md:text-xl'>
                <span className='relative cursor-pointer'>
                  <CiEdit />
                  <input
                    className='absolute top-0 right-0 bottom-0 left-0 opacity-0'
                    type='file'
                    name=''
                    id=''
                    onChange={handleFileChange}
                  />
                </span>
              </div>
            )}
          </div>
          <h1 className='font-bold text-2xl sm:text-3xl text-center mt-3'>
            {getUsername(profile?.profile_user ?? null)}
          </h1>

          <div className='flex items-center gap-4 justify-center w-full mt-4 sm:mt-6'>
            <div className='relative'>
              <Button
                className={'min-w-[120px] gap-1 px-3'}
                text={isOwner ? 'Add News' : statusFriend}
                paddingY={'py-[6px]'}
                fontSize={'sm:text-base'}
                border={'border-none'}
                background={'bg-blue-500'}
                color={'text-white'}
                Icons={
                  isOwner ? undefined : statusFriend === StatusFriend.FRIEND ? (
                    <FaUserCheck />
                  ) : statusFriend === StatusFriend.UNFRIENDED ? (
                    <FaUserPlus />
                  ) : (
                    <RiUserSharedLine />
                  )
                }
                onClick={isOwner ? undefined : handleClickAddFriend}
              />
              {showDeleteFriend && (
                <div
                  className={
                    'absolute top-[calc(100%+2px)] shadow-default min-w-[120px]'
                  }
                  ref={buttonRef}
                >
                  <Button
                    onClick={handleUnFriend}
                    className='w-full gap-1 px-3'
                    text={'Un Friend'}
                    paddingY={'py-[6px]'}
                    fontSize={'sm:text-base'}
                    border={'border-none'}
                  />
                </div>
              )}
            </div>
            <Button
              onClick={handleClickButton2}
              className={'min-w-[120px] gap-1 px-3'}
              paddingY={'py-[6px]'}
              fontSize={'sm:text-base'}
              text={
                isOwner
                  ? 'Edit Profile'
                  : statusFriend === StatusFriend.FRIEND
                  ? 'Chat now'
                  : 'Follow'
              }
            />
          </div>
        </div>
      </div>
    );
  }
);

export default UserInformation;
