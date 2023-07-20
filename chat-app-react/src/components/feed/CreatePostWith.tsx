import { FC, memo, useState } from 'react';
import { IFriend } from '../../ultils/interface';
import { Link } from 'react-router-dom';

export interface IPropCreatePostWith {
  listFriendTag: IFriend[];
}

const CreatePostWith: FC<IPropCreatePostWith> = memo(({ listFriendTag }) => {
  const [showOthers, setShowOthers] = useState(false);
  return (
    <div
      className={`${
        !listFriendTag.length && 'hidden'
      } flex items-center gap-1 pl-1`}
    >
      {listFriendTag.map((friend, idx) => {
        if (idx === 0)
          return (
            <>
              <span className='text-sm'>With</span>
              <Username
                userName={friend.userName}
                userId={friend.userId}
                border={true}
              />
            </>
          );
        else if (idx === 1)
          return (
            <>
              <span className='text-sm'>and</span>
              <Username
                userName={friend.userName}
                userId={friend.userId}
                border={true}
              />
            </>
          );
        else
          return (
            <>
              <span className='text-sm'>and</span>
              <span className='relative'>
                <p
                  onClick={() => setShowOthers(true)}
                  className='cursor-pointer border-b-2 hover:border-b-black border-b-transparent'
                >
                  {`${listFriendTag.length - 2} others`}
                </p>
                <div
                  className={`absolute top-8 right-0 ${
                    showOthers ? 'flex' : 'hidden'
                  } flex-col bg-white shadow-default min-w-[120px] rounded`}
                >
                  {listFriendTag.slice(2).map((other) => (
                    <Username
                      userName={other.userName}
                      userId={other.userId}
                      padding={2}
                      hover={'bg-gray-100 duration-300'}
                    />
                  ))}
                </div>
              </span>
            </>
          );
      })}
    </div>
  );
});

export interface IPropUsername {
  userName: string;
  userId: string;
  border?: boolean;
  padding?: number;
  hover?: string;
}

export const Username: FC<IPropUsername> = ({
  userName,
  userId,
  border,
  padding,
  hover,
}) => {
  return (
    <Link
      to={`/profile/${userId}`}
      className={`cursor-pointer ${
        border && 'border-b-2 hover:border-b-black border-b-transparent'
      } p-${padding} hover:${hover}`}
    >
      {userName}
    </Link>
  );
};

export default CreatePostWith;
