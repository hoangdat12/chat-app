import { FC } from "react";

export interface IPropAvatar {
  className?: string;
  status?: string;
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

export const AvatarOnline: FC<IPropAvatar> = (props) => {
  return (
    <div className={`${props?.className} relative rounded-full cursor-pointer`}>
      <img className='w-full rounded-full' src={props.avatarUrl} alt='' />
      <span
        className={`${
          props.status === "online" ? "block" : "hidden"
        } absolute top-[60%] translate-y-1/2 right-0 p-[5px] bg-green-500 rounded-full`}
      ></span>
      <span
        className={`${
          props.status !== "online" ? "block" : "hidden"
        } absolute -bottom-[0] left-0 w-full rounded-full text-[9px] text-center text-green-500 bg-white px-[2px]`}
      >
        6 minus
      </span>
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
