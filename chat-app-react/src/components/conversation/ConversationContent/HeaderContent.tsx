import { ButtonRounded } from '../../../pages/conversation/Conversation';
import { MdOutlineArrowBack } from 'react-icons/md';
import Avatar from '../../avatars/Avatar';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsPinAngle } from 'react-icons/bs';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { FC, MouseEventHandler, memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../app/hook';
import { selectConversation } from '../../../features/conversation/conversationSlice';
import { IConversation } from '../../../ultils/interface';
import { getUserLocalStorageItem } from '../../../ultils';

export interface IPropHeaderContent {
  handleShowMoreConversation: MouseEventHandler<HTMLAnchorElement>;
}

const HeaderContent: FC<IPropHeaderContent> = memo(
  ({ handleShowMoreConversation }) => {
    const { conversationId } = useParams();
    const { conversations } = useAppSelector(selectConversation);
    const user = getUserLocalStorageItem();
    const conversation = conversations.get(conversationId ?? '');

    const getInforChatFromConversation = useCallback(
      (conversation: IConversation | undefined) => {
        if (conversation) {
          if (conversation.conversation_type === 'group') {
            return {
              userName: conversation.nameGroup,
              avatarUrl: conversation.avatarUrl,
              status: null,
            };
          } else {
            for (let received of conversation.participants) {
              if (received.userId !== user?._id) {
                return {
                  userName: received.userName,
                  avatarUrl: received.avatarUrl,
                  status: 'online',
                };
              }
            }
          }
        } else {
          return {
            userName: null,
            avatarUrl: null,
            status: null,
          };
        }
      },
      [conversation]
    );

    const { userName, status, avatarUrl } = getInforChatFromConversation(
      conversation
    ) as IInforConversation;

    return (
      <div className='flex items-center justify-between h-16 sm:h-[5.5rem] px-4 sm:px-8 w-full shadow-nomal'>
        <div className='mr-2 block sm:hidden'>
          <ButtonRounded
            className={'text-base p-1'}
            icon={<MdOutlineArrowBack />}
            to='/conversation/all/list'
          />
        </div>
        <div className='flex w-full gap-3 cursor-pointer '>
          <div className=''>
            <Avatar
              className={'sm:w-14 sm:h-14 h-12 w-12'}
              avatarUrl={avatarUrl ?? ''}
            />
          </div>
          <div className='w-user-conversation flex flex-col justify-center'>
            <div className=''>
              <h1 className='text-base sm:text-xl font-bold'>{userName}</h1>
              <span className='text-[10px] sm:text-[12px] font-medium '>
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 text-blue-500'>
          <ButtonRounded className={'hidden sm:flex'} icon={<BsPinAngle />} />
          <ButtonRounded
            className={'text-base p-1 sm:text-[22px] sm:p-2'}
            icon={<IoCallOutline />}
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-[22px] sm:p-2'}
            icon={<IoVideocamOutline />}
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-[22px] sm:p-2'}
            icon={<IoIosInformationCircleOutline />}
            onClick={handleShowMoreConversation}
            to='/conversation/setting'
          />
        </div>
      </div>
    );
  }
);

export interface IInforConversation {
  userName: string | null;
  avatarUrl: string | null;
  status: string | null;
}

export default HeaderContent;
