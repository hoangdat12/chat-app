import { FC, memo, useEffect, useRef, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdNotificationsNone, MdOutlineArrowBack } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { AiOutlinePlusCircle } from 'react-icons/Ai';

import { ListDetailSetting } from '../../ultils/list/setting.list';
import { IConversation } from '../../ultils/interface';
import { MessageType } from '../../ultils/constant/message.constant';
import { ButtonRounded } from '../button/ButtonRounded';
import AvatarEdit from '../avatars/AvatarEdit';
import CreateNewGroup from '../modal/CreateNewGroup';
import ChangeNickName from '../modal/ChangeNickName';
import ChangeEmoji from '../modal/ChangeEmoji';
import ChangeAvatarGroup from '../modal/ChangeAvatarGroup';
import { CiEdit } from 'react-icons/ci';
import useClickOutside from '../../hooks/useClickOutside';
import { conversationService } from '../../features/conversation/conversationService';
import MenagerMember from '../modal/MenagerMember';
import Confirm from '../modal/Confirm';

export interface IPropConversationSetting {
  showMoreConversation?: boolean;
  setShowMoreConversation: (value: boolean) => void;
  userName: string;
  avatarUrl: string | null;
  status?: string | null;
  conversation: IConversation | undefined;
}

const ConversationSetting: FC<IPropConversationSetting> = memo(
  ({
    showMoreConversation,
    setShowMoreConversation,
    userName,
    avatarUrl,
    conversation,
  }) => {
    const [show, setShow] = useState<number[]>([]);

    const [isShowAddNewMember, setIsShowAddNewMember] = useState(false);
    const [isShowChangeUsername, setIsShowChangeUsername] = useState(false);
    const [isShowChangeEmoji, setIsShowChangeEmoji] = useState(false);
    const [isShowChangeAvatarOfGroup, setIsShowChangeAvatarOfGroup] =
      useState(false);
    const [isShowRenameGroup, setIsShowRenameGroup] = useState(false);
    const [newNameGroup, setNewNameGroup] = useState(userName);
    const [image, setViewImage] = useState<string | ArrayBuffer | null>(null);
    const [isShowManagerMember, setIsShowManagerMember] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);

    const modelRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleShow = (idx: number) => {
      if (show.includes(idx)) {
        setShow((prev) => prev.filter((ele) => ele !== idx));
      } else {
        setShow((prev) => [...prev, idx]);
      }
    };

    // Show modal add new Member
    const handleAddNewMember = () => {
      setShowMoreConversation(false);
      setIsShowAddNewMember(true);
    };

    const handleShowChangeUsername = () => {
      setShowMoreConversation(false);
      setIsShowChangeUsername(true);
    };

    const handleShowChangeEmoji = () => {
      setShowMoreConversation(false);
      setIsShowChangeEmoji(true);
    };

    const handleChangeNameGroup = () => {
      setIsShowRenameGroup(true);
    };

    const handleShowManegerMember = () => {
      setShowMoreConversation(false);
      setIsShowManagerMember(true);
    };

    const handleShowConfirm = () => {
      setShowMoreConversation(false);
      setIsShowConfirm(true);
    };

    const handleClick = (title: string) => {
      switch (title) {
        case 'Change username':
          handleShowChangeUsername();
          break;
        case 'Change emoji':
          handleShowChangeEmoji();
          break;
        case 'Member':
          handleShowManegerMember();
          break;
        case 'Delete conversation':
          handleShowConfirm();
          break;
        default:
          break;
      }
    };
    // Change name group
    const changeNameGroup = async () => {
      if (
        isShowRenameGroup &&
        newNameGroup !== userName &&
        newNameGroup?.trim() !== '' &&
        conversation
      ) {
        await conversationService.handleChangeNameOfGroup({
          conversationId: conversation?._id,
          nameGroup: newNameGroup,
        });
      }
      setIsShowRenameGroup(false);
    };

    useClickOutside(inputRef, changeNameGroup, 'mousedown');

    useEffect(() => {
      if (image) {
        setShowMoreConversation(false);
        setIsShowChangeAvatarOfGroup(true);
      }
    }, [image]);

    useEffect(() => {
      if (showMoreConversation) {
        const clickOutSide = (e: MouseEvent) => {
          if (
            modelRef.current &&
            !modelRef.current?.contains(e.target as Node)
          ) {
            if (isShowAddNewMember) setIsShowAddNewMember(false);
            if (isShowChangeAvatarOfGroup) setIsShowChangeAvatarOfGroup(false);
            if (isShowChangeEmoji) setIsShowChangeEmoji(false);
            if (isShowChangeUsername) setIsShowChangeUsername(false);
            setShowMoreConversation(false);
          }
        };

        document.addEventListener('mousedown', clickOutSide);

        return () => {
          document.removeEventListener('mousedown', clickOutSide);
        };
      }
    }, [showMoreConversation]);

    return (
      <>
        <div
          className={`${
            showMoreConversation
              ? 'absolute top-0 right-0 flex flex-row-reverse bg-blackOverlay'
              : 'hidden xl:block xl:col-span-3 py-6 border-[#f2f3f4]'
          } h-full w-full xl:border-l overflow-y-scroll sm:overflow-hidden scrollbar-hide font-poppins`}
        >
          <div
            className={`${
              showMoreConversation &&
              'animate__animated animate__fadeInRight w-full sm:w-[350px] bg-[#f2f3f4] py-6'
            } relative`}
            ref={modelRef}
          >
            <div className='absolute top-0 left-4 flex sm:hidden'>
              <ButtonRounded
                className={'text-lg p-2 bg-white mt-4'}
                icon={<MdOutlineArrowBack />}
                onClick={
                  setShowMoreConversation &&
                  (() => setShowMoreConversation(false))
                }
              />
            </div>
            <div className='flex flex-col items-center justify-center gap-3 cursor-pointer '>
              <div className=''>
                <AvatarEdit
                  className={'w-20 h-20'}
                  avatarUrl={avatarUrl ?? ''}
                  setViewImage={setViewImage}
                />
              </div>
              <h1 className='flex items-center justify-center gap-4 w-full'>
                {isShowRenameGroup ? (
                  <input
                    type='text'
                    className={`outline-none bg-transparent`}
                    value={newNameGroup}
                    onChange={(e) => setNewNameGroup(e.target.value)}
                    ref={inputRef}
                    autoFocus
                  />
                ) : (
                  <span className='text-2xl font-medium '> {userName}</span>
                )}
                <span
                  onClick={handleChangeNameGroup}
                  className='text-black text-lg p-1 rounded-full bg-gray-300'
                >
                  <CiEdit />
                </span>
              </h1>

              <div className='flex gap-20 mt-2 lg:mt-0 text-lg text-[#3a393c]'>
                <div className='relative'>
                  {conversation?.conversation_type === MessageType.GROUP ? (
                    <div onClick={handleAddNewMember}>
                      <ButtonRounded icon={<AiOutlinePlusCircle />} />
                      <div className='absolute -bottom-6 whitespace-nowrap left-[50%] -translate-x-1/2 text-sm'>
                        Add Member
                      </div>
                    </div>
                  ) : (
                    <>
                      <ButtonRounded icon={<CgProfile />} />
                      <div className='absolute -bottom-6 whitespace-nowrap left-[50%] -translate-x-1/2 text-sm'>
                        Profile
                      </div>
                    </>
                  )}
                </div>
                <div className='relative'>
                  <ButtonRounded icon={<MdNotificationsNone />} />
                  <div className='absolute -bottom-6 whitespace-nowrap left-[50%] -translate-x-1/2 text-sm'>
                    Notification
                  </div>
                </div>
              </div>
            </div>

            <ul className='mt-16 max-h-[calc(100vh-20rem)] pb-6 overflow-y-scroll'>
              {ListDetailSetting.map((element, idx) => (
                <li className={`${idx === 0 ? '' : 'mt-5'} px-8`} key={idx}>
                  <div className='flex items-center justify-between cursor-pointer'>
                    <span
                      onClick={() => handleShow(idx)}
                      className='text-base w-full'
                    >
                      {element.SubMenu.title}
                    </span>
                    <span
                      className={`${
                        show.includes(idx)
                          ? 'animate__animated animate__rotateIn'
                          : ''
                      }`}
                    >
                      {show.includes(idx) ? <BsChevronUp /> : <BsChevronDown />}
                    </span>
                  </div>
                  <ul
                    className={`${
                      show.includes(idx) ? 'block' : ' hidden'
                    } px-2 text-base font-light`}
                  >
                    {element.List.map((item, index) => (
                      <li
                        className='flex items-center gap-2 mt-3 cursor-pointer'
                        key={index}
                        onClick={() => handleClick(item.title)}
                      >
                        <span>
                          {item.title === 'Change emoji'
                            ? conversation?.emoji ?? '👍'
                            : item.icon}
                        </span>
                        <span className='whitespace-nowrap overflow-hidden text-ellipsis'>
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <CreateNewGroup
          isShowCreateNewGroup={isShowAddNewMember}
          setShowCreateNewGroup={setIsShowAddNewMember}
          type={'add'}
        />
        <ChangeNickName
          conversation={conversation}
          isShow={isShowChangeUsername}
          setIsShow={setIsShowChangeUsername}
        />
        <ChangeEmoji
          isShow={isShowChangeEmoji}
          setIsShow={setIsShowChangeEmoji}
        />
        <ChangeAvatarGroup
          imageUrl={image}
          setViewImage={setViewImage}
          isShow={isShowChangeAvatarOfGroup}
          setIsShow={setIsShowChangeAvatarOfGroup}
        />
        <MenagerMember
          conversation={conversation}
          isShow={isShowManagerMember}
          setIsShow={setIsShowManagerMember}
        />
        <Confirm
          conversation={conversation}
          title={'Are you sure to delete conversation?'}
          isShow={isShowConfirm}
          setIsShow={setIsShowConfirm}
        />
      </>
    );
  }
);

export default ConversationSetting;
