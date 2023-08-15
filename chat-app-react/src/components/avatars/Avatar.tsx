import { FC } from 'react';

export interface IPropAvatar {
  className?: string;
  status?: string;
  avatarUrl: string;
  onClick?: any;
}

const Avatar: FC<IPropAvatar> = ({ className, avatarUrl, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${className} overflow-hidden rounded-full cursor-pointer`}
    >
      <img className='w-full h-full' src={avatarUrl} alt='' />
    </div>
  );
};

export const AvatarOnline: FC<IPropAvatar> = (props) => {
  return (
    <div className={`${props?.className} relative rounded-full cursor-pointer`}>
      <img className='w-full rounded-full' src={props.avatarUrl} alt='' />
      {props.status && (
        <>
          <span
            className={`${
              props.status === 'online' ? 'block' : 'hidden'
            } absolute top-[65%] translate-y-1/2 right-0 p-[5px] bg-green-500 rounded-full`}
          ></span>
          <span
            className={`${
              props.status !== 'online' ? 'block' : 'hidden'
            } absolute -bottom-[0] left-0 w-full rounded-full text-[9px] text-center text-green-500 bg-white px-[2px]`}
          >
            6 minus
          </span>
        </>
      )}
    </div>
  );
};

export default Avatar;
