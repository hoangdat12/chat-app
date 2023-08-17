import { FC } from 'react';
import AvatarSquare from '../avatars/AvatarSquare';
import { AvatarOnline } from '../avatars/Avatar';
import { useNavigate } from 'react-router-dom';
import { conversationService } from '../../features/conversation/conversationService';
import { IConversation, IFriend } from '../../ultils/interface';
import {
  convertFriendToParticipant,
  convertUserToParticipant,
  getUserLocalStorageItem,
} from '../../ultils';

export interface IFriendBoxProp {
  friend: IFriend;
  status?: string;
  className?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  margin?: string;
  onClick?: any;
  onlineStatus?: string;
}

const userLocal = getUserLocalStorageItem();

const FriendBox: FC<IFriendBoxProp> = ({
  friend,
  width,
  height,
  fontSize,
  margin,
  onClick,
}) => {
  return (
    <div onClick={onClick} className='flex flex-col flex-wrap'>
      <AvatarSquare
        avatarUrl={friend.avatarUrl}
        className={`${width ?? 'w-full'} ${height ?? 'h-full'}`}
      />
      <h1 className={`${fontSize ?? 'text-base'} ${margin ?? 'mt-2'}`}>
        {friend.userName}
      </h1>
    </div>
  );
};

export const FriendBoxCircle: FC<IFriendBoxProp> = ({
  friend,
  className,
  status,
  onlineStatus,
}) => {
  const navigate = useNavigate();

  const handleChat = async () => {
    const res = await conversationService.findMatchConversation(friend._id);
    console.log(res);
    if (res.status === 200) {
      const foundConversation = res.data.metaData;
      if (foundConversation) {
        navigate(`/conversation/${foundConversation._id}`);
      } else {
        const fakeConversation: IConversation = {
          _id: friend._id,
          conversation_type: 'conversation',
          participants: [
            convertFriendToParticipant(friend),
            convertUserToParticipant(userLocal),
          ],
          lastMessage: undefined,
          updatedAt: new Date().toString(),
          createdAt: new Date().toString(),
          nameGroup: undefined,
          userId: [],
          avatarUrl: '',
          collection: '',
        };
        navigate(`/conversation/${friend._id}`, {
          state: { fakeConversation },
        });
      }
    }
  };

  return (
    <div
      onClick={handleChat}
      className='flex gap-2 items-center cursor-pointer'
    >
      <AvatarOnline
        avatarUrl={friend.avatarUrl}
        className={className}
        status={status}
      />
      <div>
        <h1 className='text-sm'>{friend.userName}</h1>
        {onlineStatus && (
          <p className='text-xs text-gray-500'>{onlineStatus}</p>
        )}
      </div>
    </div>
  );
};

export default FriendBox;
