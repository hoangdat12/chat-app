import { BsFacebook } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { MdPlace } from 'react-icons/md';
import { FC, useState } from 'react';
import { getUsername } from '../../ultils';
import ProfileSocial from './ProfileSocial';
import { IProfile } from '../../ultils/interface/profile.interface';

export interface IPropProfileInformation {
  profile: IProfile | null;
  isOwner: boolean;
  className?: string;
}

const ProfileInformation: FC<IPropProfileInformation> = ({
  profile,
  isOwner,
  className,
}) => {
  const [addSocial, setAddSocial] = useState('');
  const handleAddLinkSocial = (title: string) => {
    setAddSocial(title);
  };

  return (
    <div className={`${className} p-4 rounded-md bg-gray-100`}>
      <div className='flex items-center justify-between pb-2 border-b border-gray-300'>
        <h1 className='text-2xl'>
          {getUsername(profile?.profile_user ?? null)}
        </h1>
        <span className='text-gray-600 text-sm cursor-pointer'>
          {profile?.profile_total_friends}
        </span>
      </div>

      <div className='border-b border-gray-300 py-3'>
        <div className='flex items-start gap-2'>
          <span className='text-xl'>
            <MdPlace />
          </span>
          <span className='text-gray-700 '>
            {profile?.profile_address.address_country}
          </span>
        </div>
        <div className='flex items-start gap-2 mt-2'>
          <span className='text-xl'>
            <GrUserWorker />
          </span>
          <span className='text-gray-700 '>{profile?.profile_job}</span>
        </div>
      </div>

      <div className='text-gray-500 text-sm border-b border-gray-300 py-3'>
        <div className='flex items-center justify-between'>
          <span>Who's visited Profile</span>
          <span>{profile?.profile_viewer}</span>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <span>Total post</span>
          <span>{profile?.profile_total_post}</span>
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
          link={profile?.profile_social_facebook}
        />

        <ProfileSocial
          ICon={FaGithub}
          title={'Github'}
          isOwner={isOwner}
          onClick={handleAddLinkSocial}
          addSocial={addSocial}
          setAddSocial={setAddSocial}
          link={profile?.profile_social_github}
        />
      </div>
    </div>
  );
};

export default ProfileInformation;
