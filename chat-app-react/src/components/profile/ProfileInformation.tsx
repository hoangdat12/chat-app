import { BsFacebook } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { MdPlace } from 'react-icons/md';
import { FC, useState } from 'react';
import { IUser } from '../../ultils/interface';
import { getUsername } from '../../ultils';
import ProfileSocial from './ProfileSocial';

export interface IPropProfileInformation {
  user: IUser | null;
  isOwner: boolean;
}

const ProfileInformation: FC<IPropProfileInformation> = ({ user, isOwner }) => {
  const [addSocial, setAddSocial] = useState('');
  const handleAddLinkSocial = (title: string) => {
    setAddSocial(title);
  };

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

        <ProfileSocial
          ICon={BsFacebook}
          title={'Facebook'}
          isOwner={isOwner}
          onClick={handleAddLinkSocial}
          titleColor={'text-blue-500'}
          addSocial={addSocial}
          setAddSocial={setAddSocial}
          link={user?.social_facebook}
        />

        <ProfileSocial
          ICon={FaGithub}
          title={'Github'}
          isOwner={isOwner}
          onClick={handleAddLinkSocial}
          addSocial={addSocial}
          setAddSocial={setAddSocial}
          link={user?.social_facebook}
        />
      </div>
    </div>
  );
};

export default ProfileInformation;
