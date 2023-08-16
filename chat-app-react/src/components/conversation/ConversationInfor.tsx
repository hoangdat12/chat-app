import { FC, useEffect } from 'react';
import Avatar, { IPropAvatar } from '../avatars/Avatar';
import { IConversation, IUser } from '../../ultils/interface';
import { format } from 'date-fns';
import { getUserLocalStorageItem } from '../../ultils';
import { MessageContentType } from '../../ultils/constant/message.constant';

export interface IPropConversation {
  active?: boolean;
  avatarUrl: string;
  nickName: string;
  status: string;
  conversation: IConversation;
  isReadLastMessage: boolean;
  setIsReadLastMessage: (value: boolean) => void;
}

const ConversationInfor: FC<IPropConversation> = ({
  active,
  avatarUrl,
  nickName,
  // status,
  conversation,
  isReadLastMessage,
  setIsReadLastMessage,
}) => {
  useEffect(() => {
    const checkUserIsReadLastMessageOfConversation = () => {
      const user = getUserLocalStorageItem() as IUser;
      for (let participant of conversation.participants) {
        if (participant.userId === user._id) {
          setIsReadLastMessage(participant.isReadLastMessage);
          return;
        }
      }
      setIsReadLastMessage(false);
    };
    checkUserIsReadLastMessageOfConversation();
  }, [isReadLastMessage, conversation]);
  return (
    <div
      className={`flex gap-3 py-4 px-4 xl:px-6 border-b-[2px] ${
        active ? 'border-white' : 'border-[#e8ebed]'
      }`}
    >
      {true ? (
        <Avatar
          avatarUrl={avatarUrl}
          className='h-9 w-9 min-w-[2.25rem] min-h-[2.25rem] md:h-11 md:w-11 md:min-w-[2.75rem] md:min-h-[2.75rem]'
        />
      ) : (
        <Avatar avatarUrl={avatarUrl} />
      )}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <span className='' aria-hidden='true' />
          <div className='flex justify-between items-center mb-1'>
            <p
              className={`text-sm md:text-base ${
                !isReadLastMessage
                  ? 'font-bold text-gray-900'
                  : 'font-medium text-gray-700'
              }`}
            >
              {nickName}
            </p>
            {((conversation?.lastMessage &&
              conversation.lastMessage.message_content !== '') ||
              conversation?.createdAt) && (
              <p
                className={`
                  text-[10px] md:text-xs
                  ${
                    !isReadLastMessage
                      ? 'text-gray-800 font-medium '
                      : 'text-gray-400 font-light'
                  }
                `}
              >
                {format(
                  new Date(
                    conversation?.lastMessage?.createdAt ??
                      conversation?.createdAt ??
                      ''
                  ),
                  'p'
                )}
              </p>
            )}
          </div>
          <p
            className={`
          truncate
          text-xs md:text-sm
          ${!isReadLastMessage ? 'text-black font-medium' : 'text-gray-500'}`}
          >
            {conversation?.lastMessage?.message_content_type ===
            MessageContentType.IMAGE
              ? `${conversation?.lastMessage?.message_sender_by.userName} sent 1 photo`
              : conversation?.lastMessage?.message_content}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ConversationInforMobile: FC<IPropAvatar> = ({ avatarUrl }) => {
  return (
    <div className='flex justify-center py-2'>
      <Avatar className={'xl:w-14 xl:h-14 h-12 w-12'} avatarUrl={avatarUrl} />
    </div>
  );
};

export default ConversationInfor;
