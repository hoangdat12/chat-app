import { ButtonRounded } from '../../../pages/conversation/Conversation';
import { MdOutlineArrowBack } from 'react-icons/md';
import Avatar from '../../avatars/Avatar';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsPinAngle } from 'react-icons/bs';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { FC, MouseEventHandler } from 'react';

export interface IPropHeaderContent {
  handleShowMoreConversation: MouseEventHandler<HTMLAnchorElement>;
}

const HeaderContent: FC<IPropHeaderContent> = ({
  handleShowMoreConversation,
}) => {
  return (
    <div className='flex items-center justify-between h-16 sm:h-[5.5rem] px-4 sm:px-8 w-full shadow-nomal'>
      <div className='mr-2 block sm:hidden'>
        <ButtonRounded
          className={'text-base p-1'}
          icon={<MdOutlineArrowBack />}
          to='/conversation'
        />
      </div>
      <div className='flex w-full gap-3 cursor-pointer '>
        <div className=''>
          <Avatar
            className={'sm:w-14 sm:h-14 h-12 w-12'}
            avatarUrl={
              'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1'
            }
          />
        </div>
        <div className='w-user-conversation flex flex-col justify-center'>
          <div className=''>
            <h1 className='text-base sm:text-xl font-bold'>Hoang Dat</h1>
            <span className='text-[10px] sm:text-[12px] font-medium '>
              Active
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
};

export default HeaderContent;
