import { FC } from 'react';
import { AvatarOnline } from './Avatar';
import { IParticipant } from '../../ultils/interface';

export interface IPropUserAdd {
  friend: IParticipant;
}

export const AvatarUserAdd: FC<IPropUserAdd> = ({ friend }) => {
  return (
    <div className='flex gap-2 items-center '>
      <AvatarOnline
        className={'w-10 h-10'}
        avatarUrl={friend.avatarUrl}
        status={'online'}
      />
      <h1 className=''>{friend.userName}</h1>
    </div>
  );
};
