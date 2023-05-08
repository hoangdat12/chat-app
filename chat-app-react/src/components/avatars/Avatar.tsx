import { FC } from "react";

export interface IPropAvatar {
  className?: string;
  avatarUrl: string;
}

const Avatar: FC<IPropAvatar> = (props) => {
  return (
    <div
      className={`${props?.className} overflow-hidden rounded-full cursor-pointer`}
    >
      <img className='w-full rounded-full' src={props.avatarUrl} alt='' />
    </div>
  );
};

export const AvatarSquare: FC<IPropAvatar> = (props) => {
  return (
    <div
      className={`${props?.className} overflow-hidden rounded-md cursor-pointer relative`}
    >
      <img className='w-full rounded-md' src={props.avatarUrl} alt='' />
    </div>
  );
};

export default Avatar;
