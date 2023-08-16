import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/Ai';
import { AvatarOnline } from './Avatar';
import { IFriend } from '../../ultils/interface/friend.interface';
import { IParticipant } from '../../ultils/interface';
import { convertFriendToParticipant } from '../../ultils';

export interface IPropAvatarSearch {
  friend: IFriend;
  setListUserAddGroup?: Dispatch<SetStateAction<IParticipant[]>>;
  setMember: (value: any) => void;
  isShowCreateNewGroup: boolean;
}

export const AvatarSearch: FC<IPropAvatarSearch> = ({
  friend,
  setListUserAddGroup,
  setMember,
  isShowCreateNewGroup,
}) => {
  const [add, setAdd] = useState(false);
  const handleAddUser = (data: IFriend) => {
    const friendAdd: IParticipant = convertFriendToParticipant(data);
    if (setListUserAddGroup) {
      if (!add) {
        setListUserAddGroup((prev) => [...prev, friendAdd]);
        setMember((prev: number) => prev + 1);
      } else {
        setListUserAddGroup((prev) =>
          prev.filter((pre) => pre.userId !== friend._id)
        );
        setMember((prev: number) => prev - 1);
      }
      setAdd(!add);
    }
  };

  useEffect(() => {
    if (isShowCreateNewGroup === false) {
      setAdd(false);
    }
  }, [isShowCreateNewGroup]);

  return (
    <div className='flex items-center justify-between mt-4 cursor-pointer'>
      <div className='flex gap-2 items-center '>
        <AvatarOnline
          className={'w-10 h-10'}
          avatarUrl={friend.avatarUrl}
          status={'online'}
        />
        <h1 className='text-sm md:text-base'>{friend.userName}</h1>
      </div>

      <div
        onClick={() => handleAddUser(friend)}
        className={`hidden md:flex px-3 mr-2 py-1 rounded-md bg-white ${
          add ? 'text-blue-500 ' : 'text-black'
        }`}
      >
        <button className={`text-[12px] lg:text-sm `}>
          {add ? 'Remove' : 'Add'}
        </button>
      </div>
      <div
        className={`flex md:hidden px-2 md:px-3 mr-2 py-1 rounded-md ${
          add ? 'bg-blue-500 text-white' : 'bg-white '
        }`}
      >
        <button
          onClick={() => handleAddUser(friend)}
          className='text-[12px] md:text-sm'
        >
          {add ? <AiOutlineClose /> : <AiOutlinePlus />}
        </button>
      </div>
    </div>
  );
};
