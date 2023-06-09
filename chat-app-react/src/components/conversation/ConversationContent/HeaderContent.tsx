import { MdOutlineArrowBack, MdOutlineArrowForward } from 'react-icons/md';
import Avatar from '../../avatars/Avatar';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsPinAngle } from 'react-icons/bs';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { FC, MouseEventHandler, memo } from 'react';
import { ButtonRounded } from '../../button/ButtonRounded';

export interface IPropHeaderContent {
  handleShowMoreConversation: MouseEventHandler<HTMLAnchorElement>;
  handleShowListConversation?: () => void;
  showListConversationSM?: boolean;
  userName: string | null;
  avatarUrl: string | null;
  status?: string | null;
}

const HeaderContent: FC<IPropHeaderContent> = memo(
  ({
    handleShowMoreConversation,
    handleShowListConversation,
    showListConversationSM,
    userName,
    avatarUrl,
    status,
  }) => {
    return (
      <div className='flex items-center justify-between h-16 sm:h-[5.5rem] px-4 sm:px-8 w-full shadow-nomal'>
        {/* Mobile */}
        <div className='mr-2 block sm:hidden'>
          <ButtonRounded
            className={'text-base p-1'}
            icon={<MdOutlineArrowBack />}
            to='/conversation/all/list'
          />
        </div>
        {/* Reponsive for sm */}
        <div className='mr-4 hidden sm:block md:hidden'>
          <span
            onClick={handleShowListConversation}
            className='flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer'
          >
            {showListConversationSM ? (
              <MdOutlineArrowBack />
            ) : (
              <MdOutlineArrowForward />
            )}
          </span>
        </div>
        {/* All */}
        <div className='flex w-full gap-3 cursor-pointer '>
          <div className=''>
            <Avatar
              className={'md:w-14 md:h-14 h-12 w-12'}
              avatarUrl={avatarUrl ?? ''}
            />
          </div>
          <div className='w-user-conversation flex flex-col justify-center'>
            <div className=''>
              <h1 className='text-base sm:text-lg md:text-xl font-bold'>
                {userName}
              </h1>
              <span className='text-[10px] sm:text-[12px] font-medium '>
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 text-blue-500'>
          <ButtonRounded className={'hidden md:flex'} icon={<BsPinAngle />} />
          <ButtonRounded
            className={'text-base p-1 sm:text-lg md:text-[22px] sm:p-2'}
            icon={<IoCallOutline />}
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-lg md:text-[22px] sm:p-2'}
            icon={<IoVideocamOutline />}
          />
          <ButtonRounded
            className={'text-base p-1 sm:text-lg md:text-[22px] sm:p-2'}
            icon={<IoIosInformationCircleOutline />}
            onClick={handleShowMoreConversation}
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
