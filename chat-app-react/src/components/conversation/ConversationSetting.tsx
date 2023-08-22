import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import {
  MdNotificationsNone,
  MdOutlineArrowBack,
  MdOutlineNotificationsOff,
} from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { AiOutlinePlusCircle } from 'react-icons/Ai';

import { getListSetting } from '../../ultils/list/setting.list';
import { IConversation } from '../../ultils/interface';
import { MessageType } from '../../ultils/constant/message.constant';
import { ButtonRounded } from '../button/ButtonRounded';
import AvatarEdit from '../avatars/AvatarEdit';
import CreateNewGroup from '../modal/CreateNewGroup';
import ChangeNickName from '../modal/ChangeNickName';
import ChangeEmoji from '../modal/ChangeEmoji';
import { CiEdit } from 'react-icons/ci';
import useClickOutside from '../../hooks/useClickOutside';
import { conversationService } from '../../features/conversation/conversationService';
import MenagerMember from '../modal/MenagerMember';
import Confirm from '../modal/Confirm';
import NotAllowed from '../NotAllowed';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { useNavigate } from 'react-router-dom';
import {
  handleDeleteConversation,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { deleteAllMessageOfConversation } from '../../features/message/messageSlice';
import { ListConversationSetting } from '../../ultils/constant/setting.constant';
import { IInforConversation } from './ConversationContent/HeaderContent';
import { getUserLocalStorageItem, getUserNameAndAvatarUrl } from '../../ultils';
import InputAutoFocus from '../input/InputAutoFocus';
import MessageImge from '../message/MessageImge';
import { setIsError } from '../../features/showError';

export interface IPropConversationSetting {
  showMoreConversation?: boolean;
  setShowMoreConversation: (value: boolean) => void;
  conversation: IConversation | undefined;
  isValidSendMessage: boolean;
}

const userLocal = getUserLocalStorageItem();

const ConversationSetting: FC<IPropConversationSetting> = memo(
  ({
    showMoreConversation,
    setShowMoreConversation,
    conversation,
    isValidSendMessage,
  }) => {
    const [show, setShow] = useState<number[]>([]);

    const [isShowAddNewMember, setIsShowAddNewMember] = useState(false);
    const [isShowChangeUsername, setIsShowChangeUsername] = useState(false);
    const [isShowChangeEmoji, setIsShowChangeEmoji] = useState(false);
    const [isShowChangeAvatarOfGroup, setIsShowChangeAvatarOfGroup] =
      useState(false);
    const [isShowRenameGroup, setIsShowRenameGroup] = useState(false);

    const getInforChatFromConversation = useCallback(getUserNameAndAvatarUrl, [
      conversation,
    ]);
    const {
      userName,
      avatarUrl,
      userId,
      receiveNotification: isReceiveNotification,
    } = getInforChatFromConversation(
      userLocal,
      conversation
    ) as unknown as IInforConversation;

    const [newNameGroup, setNewNameGroup] = useState<string>(userName ?? '');
    const [isShowManagerMember, setIsShowManagerMember] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState<string>('');
    const [receiveNotification, setReceiveNotification] = useState(
      isReceiveNotification
    );
    const [showListImages, setShowListImages] = useState(false);

    const modelRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { conversations } = useAppSelector(selectConversation);

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

    const handleShowConfirm = (title: string) => {
      setShowMoreConversation(false);
      setIsShowConfirm(title);
    };

    const handleClick = (title: string) => {
      switch (title) {
        case ListConversationSetting.CHANGE_USERNAME:
          handleShowChangeUsername();
          break;
        case ListConversationSetting.CHANGE_EMOJI:
          handleShowChangeEmoji();
          break;
        case ListConversationSetting.MEMBER:
          handleShowManegerMember();
          break;
        case ListConversationSetting.DELETE_MESSAGES:
          handleShowConfirm(title);
          break;
        case ListConversationSetting.LEAVE_GROUP:
          handleShowConfirm(title);
          break;
        case ListConversationSetting.IMAGE:
          setShowListImages(true);
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
        const res = await conversationService.handleChangeNameOfGroup({
          conversationId: conversation?._id,
          nameGroup: newNameGroup,
        });
        if (res.status === 200) {
          setNewNameGroup(res.data.metaData.nameGroup ?? '');
        } else {
          dispatch(setIsError());
        }
      }
      setIsShowRenameGroup(false);
    };

    // Handle delete messages
    const handleDeleteMessages = async () => {
      if (conversation) {
        dispatch(handleDeleteConversation(conversation._id));
        dispatch(deleteAllMessageOfConversation());
        const nextConversation = Array.from(conversations.values())[0];
        navigate(`/conversation/${nextConversation?._id ?? 1}`);
      }
      setIsShowConfirm('');
    };

    // Handle leave messages
    const handleLeaveConversation = async () => {
      if (conversation) {
        await conversationService.handleLeaveGroup(conversation?._id);
        setIsShowConfirm('');
      }
    };

    const handleTurnOnOffNotification = async () => {
      if (conversation) {
        const res = await conversationService.changeNotification(
          conversation._id
        );
        if (res.status === 200 || res.status === 201) {
          setReceiveNotification((prev) => !prev);
        } else {
          dispatch(setIsError());
        }
      }
    };

    useClickOutside(inputRef, changeNameGroup, 'mousedown', newNameGroup);

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
              : 'hidden xl:block xl:col-span-3 border-[#f2f3f4]'
          } h-full w-full xl:border-l overflow-y-scroll sm:overflow-hidden scrollbar-hide font-poppins`}
        >
          <div
            className={`${
              showMoreConversation &&
              'animate__animated animate__fadeInRight w-full sm:w-[350px] h-full bg-[#f2f3f4] py-6'
            } relative py-6`}
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
            <div className='relative flex flex-col items-center justify-center gap-3 cursor-pointer '>
              <NotAllowed isValidSendMessage={!isValidSendMessage} />
              <div className=''>
                <AvatarEdit
                  className={'w-20 h-20'}
                  avatarUrl={avatarUrl ?? ''}
                  conversation={conversation}
                />
              </div>
              <h1 className='flex items-center justify-center gap-4 w-full text-[#282525]'>
                {isShowRenameGroup ? (
                  <InputAutoFocus
                    newNameGroup={newNameGroup}
                    setNewNameGroup={setNewNameGroup}
                    inputRef={inputRef}
                    handlerEnter={changeNameGroup}
                  />
                ) : (
                  <span className='text-2xl font-medium'> {userName}</span>
                )}
                {conversation?.conversation_type === 'group' && (
                  <span
                    onClick={handleChangeNameGroup}
                    className='text-black text-lg p-1 rounded-full bg-gray-300'
                  >
                    <CiEdit />
                  </span>
                )}
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
                    <div onClick={() => navigate(`/profile/${userId}`)}>
                      <ButtonRounded icon={<CgProfile />} />
                      <div className='absolute -bottom-6 whitespace-nowrap left-[50%] -translate-x-1/2 text-sm'>
                        Profile
                      </div>
                    </div>
                  )}
                </div>
                <div onClick={handleTurnOnOffNotification} className='relative'>
                  <ButtonRounded
                    icon={
                      receiveNotification ? (
                        <MdNotificationsNone />
                      ) : (
                        <MdOutlineNotificationsOff />
                      )
                    }
                  />
                  <div className='absolute -bottom-6 whitespace-nowrap left-[50%] -translate-x-1/2 text-sm'>
                    Notification
                  </div>
                </div>
              </div>
            </div>

            <ul className='mt-16 max-h-[calc(100vh-20rem)] pb-12 overflow-y-scroll'>
              {getListSetting(conversation?.conversation_type).map(
                (element, idx) => (
                  <li className={`${idx === 0 ? '' : 'mt-5'} px-8`} key={idx}>
                    <div className='relative flex items-center justify-between cursor-pointer'>
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
                        {show.includes(idx) ? (
                          <BsChevronUp />
                        ) : (
                          <BsChevronDown />
                        )}
                      </span>
                    </div>

                    <ul
                      className={`${
                        show.includes(idx) ? 'block' : ' hidden'
                      } relative px-2 text-base font-light`}
                    >
                      {element.SubMenu.title ===
                        ListConversationSetting.CUSTOME_CONVERSATION && (
                        <NotAllowed isValidSendMessage={!isValidSendMessage} />
                      )}

                      {element.List.map((item, index) => (
                        <li className='relative' key={index}>
                          {(item?.title ===
                            ListConversationSetting.LEAVE_GROUP ||
                            item?.title === ListConversationSetting.MEMBER) && (
                            <NotAllowed
                              isValidSendMessage={!isValidSendMessage}
                            />
                          )}
                          <div
                            onClick={() => handleClick(item?.title ?? '')}
                            className='flex items-center gap-2 mt-2 cursor-pointer'
                          >
                            <span className='text-[#514a4a]'>
                              {item?.title ===
                              ListConversationSetting.CHANGE_EMOJI
                                ? conversation?.emoji ?? '👍'
                                : item?.icon}
                            </span>
                            <span className='whitespace-nowrap overflow-hidden text-ellipsis'>
                              {item?.title}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              )}
            </ul>

            {showListImages && (
              <MessageImge
                conversationId={conversation?._id}
                setShowListImage={setShowListImages}
              />
            )}
          </div>
        </div>
        {isShowAddNewMember && (
          <CreateNewGroup
            isShowCreateNewGroup={isShowAddNewMember}
            setShowCreateNewGroup={setIsShowAddNewMember}
            type={'add'}
          />
        )}
        {isShowChangeUsername && (
          <ChangeNickName
            conversation={conversation}
            isShow={isShowChangeUsername}
            setIsShow={setIsShowChangeUsername}
          />
        )}
        {isShowChangeEmoji && (
          <ChangeEmoji
            isShow={isShowChangeEmoji}
            setIsShow={setIsShowChangeEmoji}
          />
        )}
        {isShowManagerMember && (
          <MenagerMember
            conversation={conversation}
            isShow={isShowManagerMember}
            setIsShow={setIsShowManagerMember}
            isValidSendMessage={isValidSendMessage}
          />
        )}
        {isShowConfirm !== '' && (
          <Confirm
            title={'Are you sure to delete conversation?'}
            isShow={isShowConfirm}
            setIsShow={setIsShowConfirm}
            handleSave={
              isShowConfirm === ListConversationSetting.DELETE_MESSAGES
                ? handleDeleteMessages
                : handleLeaveConversation
            }
          />
        )}
      </>
    );
  }
);

export default ConversationSetting;
