import Avatar from '../avatars/Avatar';
import { BsPersonPlusFill } from 'react-icons/bs';
import Button from '../button/Button';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IPropProfileFriend {
  userId: string | undefined;
}

const ProfileFriend: FC<IPropProfileFriend> = ({ userId }) => {
  const navigate = useNavigate();
  return (
    <div className='p-4 rounded-md bg-gray-100'>
      <h1 className='text-lg md:text-xl xl:text-2xl font-medium'>Friends</h1>
      <div className='flex flex-col gap-3'>
        {[1, 2, 3, 4].map((item) => (
          <FriendBoxDetail key={item} />
        ))}
      </div>
      <div
        onClick={() => navigate(`/profile/${userId}/friends`)}
        className='flex items-center justify-center mt-4'
      >
        <Button text={'Show more'} border={'border-none'} />
      </div>
    </div>
  );
};

export const FriendBoxDetail = () => {
  return (
    <div className='flex items-center justify-between mt-4'>
      <div className='flex items-center gap-2'>
        <Avatar
          avatarUrl={
            'https://flowbite.com/application-ui/demo/images/users/jese-leos-2x.png'
          }
          className='w-12 h-12'
        />
        <div className='flex flex-col'>
          <span className='cursor-pointer'>Hoang Dat</span>
          <span className='text-sm text-gray-700'>22th Birthday</span>
        </div>
      </div>
      <span className='cursor-pointer'>
        <BsPersonPlusFill />
      </span>
    </div>
  );
};

export default ProfileFriend;
