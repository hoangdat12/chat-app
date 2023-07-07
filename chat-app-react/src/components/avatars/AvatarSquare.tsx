import { FC } from 'react';
import { IPropAvatar } from './Avatar';

export const AvatarSquare: FC<IPropAvatar> = ({ avatarUrl, className }) => {
  return (
    <div
      className={`${className} overflow-hidden rounded-md cursor-pointer relative`}
    >
      <img className='w-full rounded-md' src={avatarUrl} alt='' />
    </div>
  );
};

export default AvatarSquare;
