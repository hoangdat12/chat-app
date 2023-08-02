import { BsFacebook } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { MdPlace } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';
import { FC } from 'react';
import { IUser } from '../../ultils/interface';
import { getUsername } from '../../ultils';

export interface IPropProfileInformation {
  user: IUser | null;
  isOwner: boolean;
}

const ProfileInformation: FC<IPropProfileInformation> = ({ user, isOwner }) => {
  return (
    <div className='p-4 rounded-md bg-gray-100'>
      <div className='flex items-center justify-between pb-2 border-b border-gray-300'>
        <h1 className='text-2xl'>{getUsername(user)}</h1>
        <span className='text-gray-600 text-sm cursor-pointer'>
          {user?.friends}
        </span>
      </div>

      <div className='border-b border-gray-300 py-3'>
        <div className='flex items-start gap-2'>
          <span className='text-xl'>
            <MdPlace />
          </span>
          <span className='text-gray-700 '>{user?.address}</span>
        </div>
        <div className='flex items-start gap-2 mt-2'>
          <span className='text-xl'>
            <GrUserWorker />
          </span>
          <span className='text-gray-700 '>{user?.job}</span>
        </div>
      </div>

      <div className='text-gray-500 text-sm border-b border-gray-300 py-3'>
        <div className='flex items-center justify-between'>
          <span>Who's visited Profile</span>
          <span>{user?.viewer}</span>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <span>Total post</span>
          <span>{user?.total_post}</span>
        </div>
      </div>

      <div className='mt-3'>
        <h1 className='text-lg mb-2'>Social Profile</h1>
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-3 items-start cursor-pointer'>
            <span className='text-2xl text-blue-500 mt-[2px]'>
              <BsFacebook />
            </span>
            <span>
              <h1 className='text-sm text-gray-700'>Facebook</h1>
              <p className='text-xs text-gray-500'>Social Network</p>
            </span>
          </div>
          {isOwner && (
            <span className='text-xl cursor-pointer'>
              <RiPencilFill />
            </span>
          )}
        </div>

        <div className='flex gap-2 items-center justify-between mt-2'>
          <div className='flex gap-3 items-start cursor-pointer'>
            <span className='text-2xl mt-[2px]'>
              <FaGithub />
            </span>
            <span>
              <h1 className='text-sm text-gray-700'>Github</h1>
              <p className='text-xs text-gray-500'>Social Network</p>
            </span>
          </div>
          {isOwner && (
            <span className='text-xl cursor-pointer'>
              <RiPencilFill />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
