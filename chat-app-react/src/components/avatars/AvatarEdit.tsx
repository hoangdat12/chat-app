import { FC } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IPropAvatar } from './Avatar';
import { IConversation } from '../../ultils/interface';

export interface IPropAvatarEdit extends IPropAvatar {
  conversation?: IConversation | undefined;
  setViewImage: (value: string | ArrayBuffer | null) => void;
}

const allowedFileTypes = 'image/gif, image/png, image/jpeg, image/x-png';

const AvatarEdit: FC<IPropAvatarEdit> = ({
  avatarUrl,
  className,
  setViewImage,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      const imageReader = new FileReader();
      imageReader.readAsDataURL(image);
      imageReader.onloadend = () => {
        setViewImage(imageReader.result);
      };
    }
  };

  return (
    <div className='relative'>
      <div
        className={`${className} overflow-hidden rounded-full cursor-pointer`}
      >
        <img className='w-full rounded-full' src={avatarUrl} alt='' />
      </div>
      <span className='absolute bottom-0 left-1 translate-y-1/4 text-black text-lg p-1 rounded-full bg-gray-300'>
        <CiEdit />
      </span>
      <input
        type='file'
        className='absolute top-0 left-0 right-0 bottom-0 rounded-full opacity-0 cursor-pointer'
        onChange={(e) => handleFileChange(e)}
        accept={allowedFileTypes}
      />
    </div>
  );
};

export default AvatarEdit;
