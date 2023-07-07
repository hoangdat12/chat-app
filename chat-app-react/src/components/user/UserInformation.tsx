import { FC } from 'react';
import { CiEdit } from 'react-icons/ci';
import { getUsername } from '../../ultils';
import Button from '../button/Button';
import { StatusFriend } from '../../pages/profile/Profile';
import { IUser } from '../../ultils/interface';
import { FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { RiUserSharedLine } from 'react-icons/ri';

export interface IUserInformationProp {
  user: IUser | null;
  isOwner: boolean;
  statusFriend: string;
  handleClickAddFriend?: () => void;
}

const UserInformation: FC<IUserInformationProp> = ({
  user,
  isOwner,
  statusFriend,
  handleClickAddFriend,
}) => {
  return (
    <div className='relative h-[280px] sm:h-[360px]'>
      <img
        className='w-full h-full shadow-lg object-cover'
        src='https://source.unsplash.com/1600x900/?nature,photography,technology'
        alt='user-pic'
      />
      <div className='absolute top-4 left-4 p-2 rounded-full bg-gray-50 cursor-pointer sm:text-xl md:text-3xl'>
        <CiEdit />
      </div>
      <div className='absolute top-1/2 left-[50%] -translate-x-1/2 translate-y-[40%] flex flex-col items-center justify-center'>
        <img
          className='w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-full border-2 border-pink-600 p-[1px] cursor-pointer'
          src={user?.avatarUrl}
          alt='user-pic'
        />
        <h1 className='font-bold text-2xl sm:text-3xl text-center mt-3'>
          {getUsername(user)}
        </h1>

        <div className='flex items-center gap-4 justify-center w-full mt-4 sm:mt-6'>
          <Button
            className={'min-w-[120px]'}
            text={isOwner ? 'Add News' : statusFriend}
            paddingY={'py-1'}
            fontSize={'sm:text-lg'}
            border={'border-none'}
            background={'bg-blue-500'}
            color={'text-white'}
            Icons={
              statusFriend === StatusFriend.FRIEND ? (
                <FaUserCheck />
              ) : statusFriend === StatusFriend.UNFRIENDED ? (
                <FaUserPlus />
              ) : (
                <RiUserSharedLine />
              )
            }
            onClick={handleClickAddFriend}
          />
          <Button
            className={'min-w-[120px]'}
            text={isOwner ? 'Edit Profile' : 'Follow'}
            paddingY={'py-1'}
            fontSize={'sm:text-lg'}
          />
          <Button
            className={'text-center align-middle'}
            text={'...'}
            paddingY={'py-1'}
            fontSize={'sm:text-lg'}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
