import { FC } from 'react';
import Avatar, { IPropAvatar } from '../avatars/Avatar';
import { IConversation } from '../../ultils/interface';
import { format } from 'date-fns';

export interface IPropConversation {
  active?: boolean;
  avatarUrl: string;
  nickName: string;
  status: string;
  conversation: IConversation;
}

const ConversationInfor: FC<IPropConversation> = ({
  active,
  avatarUrl,
  nickName,
  // status,
  conversation,
}) => {
  return (
    <div
      className={`flex gap-3 py-4 px-4 xl:px-6 border-b-[2px] ${
        active ? 'border-white' : 'border-[#e8ebed]'
      }`}
    >
      {true ? (
        <Avatar
          avatarUrl={avatarUrl}
          className='h-9
          w-9
          md:h-11
          md:w-11'
        />
      ) : (
        <Avatar avatarUrl={avatarUrl} />
      )}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <span className='' aria-hidden='true' />
          <div className='flex justify-between items-center mb-1'>
            <p className='text-md font-medium text-gray-900'>{nickName}</p>
            {conversation.lastMessage && (
              <p
                className='
              text-xs
              text-gray-400
              font-light
            '
              >
                {format(
                  new Date(
                    conversation?.lastMessage?.createdAt ??
                      conversation?.createdAt
                  ),
                  'p'
                )}
              </p>
            )}
          </div>
          <p
            className={`
          truncate
          text-sm

          ${true ? 'text-gray-500' : 'text-black font-medium'}`}
          >
            {conversation?.lastMessage?.message_content}
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
