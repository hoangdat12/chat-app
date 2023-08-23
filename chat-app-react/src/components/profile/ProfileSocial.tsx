import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { RiPencilFill } from 'react-icons/ri';
import useClickOutside from '../../hooks/useClickOutside';
import { IDataUpdateSocialLink } from '../../ultils/interface';
import { userService } from '../../features/user/userService';
import useEnterListener from '../../hooks/useEnterEvent';

export interface IPropProfileSocial {
  ICon: any;
  title: string;
  isOwner: boolean;
  onClick: any;
  titleColor?: string;
  addSocial: string;
  setAddSocial: Dispatch<SetStateAction<string>>;
  link: string | undefined;
}

const ProfileSocial: FC<IPropProfileSocial> = ({
  ICon,
  title,
  isOwner,
  onClick,
  titleColor,
  addSocial,
  setAddSocial,
  link,
}) => {
  const [inputLink, setInputLink] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleNavigate = () => {
    if (link && link !== 'default' && link.startsWith('https://')) {
      window.open(link);
    }
  };

  const handleUpdateSocialLink = async () => {
    if (
      addSocial !== '' &&
      inputLink !== '' &&
      inputLink.startsWith('https://')
    ) {
      const data: IDataUpdateSocialLink = {
        type: addSocial,
        social_link: inputLink.trim(),
      };
      const res = await userService.updateSocialLink(data);
      link = res.data.metaData.social_link;
    }
    setAddSocial('');
    setInputLink('');
  };

  const handleClickOutSide = () => {
    setAddSocial('');
    setInputLink('');
  };

  useClickOutside(inputRef, handleClickOutSide, 'mousedown');
  useEnterListener(handleUpdateSocialLink, inputLink, addSocial !== '');

  return (
    <div className='flex gap-2 items-center justify-between mt-2'>
      <div
        onClick={handleNavigate}
        className='flex gap-3 items-start cursor-pointer w-full'
      >
        <span className={`${titleColor} text-2xl mt-[2px]`}>
          <ICon />
        </span>
        {addSocial === title ? (
          <div className='flex w-full'>
            <input
              ref={inputRef}
              value={inputLink}
              onChange={(e: any) => setInputLink(e.target.value)}
              type='text'
              name=''
              id=''
              className='w-full outline-none px-3 rounded-md text-xs py-2'
              placeholder='Paste link Your Social Media ...'
            />
          </div>
        ) : (
          <span>
            <h1 className={`text-sm ${titleColor ?? 'text-gray-700'}`}>
              {title}
            </h1>
            <p className='text-xs text-gray-500'>Social Network</p>
          </span>
        )}
      </div>
      {isOwner && (
        <span onClick={() => onClick(title)} className='text-xl cursor-pointer'>
          <RiPencilFill />
        </span>
      )}
    </div>
  );
};

export default ProfileSocial;
