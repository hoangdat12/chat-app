import { memo, useEffect, useRef } from 'react';

import { IoSearch, IoNotificationsOutline } from 'react-icons/io5';

import { AiOutlineMenu, AiOutlinePlus } from 'react-icons/Ai';
import { BsBook } from 'react-icons/bs';
import { FC, useState } from 'react';

import Avatar from '../../avatars/Avatar';
import useInnerWidth from '../../../hooks/useInnterWidth';
import CreateNewGroup from '../../modal/CreateNewGroup';
import Notification from '../../modal/Notification';
import { IUser } from '../../../ultils/interface';
import useDebounce from '../../../hooks/useDebounce';
import { AiOutlineClose } from 'react-icons/Ai';
import { useNavigate, useParams } from 'react-router-dom';
import UserBox from '../../box/UserBox';
import { userService } from '../../../features/user/userService';
import Loading from '../../button/Loading';
import { getUserLocalStorageItem, getUsername } from '../../../ultils';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { readNotify, selectNotify } from '../../../features/notify/notifySlice';
import Button from '../../button/Button';
import useClickOutside from '../../../hooks/useClickOutside';
import Confirm from '../../modal/Confirm';
import { authService } from '../../../features/auth/authService';
import LoadingScreen from '../../button/LoadingScreen';
import { RiMessengerLine } from 'react-icons/ri';
import {
  resetUnReadNumberMessage,
  selectMessage,
} from '../../../features/message/messageSlice';
import { selectConversation } from '../../../features/conversation/conversationSlice';
import { setIsError } from '../../../features/showError';

export interface IPropHeader {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showMobile: boolean;
  setShowMobile: (showMobile: boolean) => void;
}

export interface IPopSearchBox {
  className?: string;
  width?: string;
  height?: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isLoading?: boolean;
  isShow?: boolean;
  setIsShow?: (value: boolean) => void;
  users?: IUser[];
}

const userLocal = getUserLocalStorageItem();

const Header: FC<IPropHeader> = memo(
  ({ setIsOpen, isOpen, setShowMobile, showMobile }) => {
    const [isSearch, setIsSearch] = useState(false);
    const [isShowModelCreate, setIsShowModelCreate] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [isShowSearchModal, setIsShowSearchModal] = useState(false);
    const [userSearch, setUserSearch] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [showModelConfirm, setShowModelConfirm] = useState('');
    const innerWidth = useInnerWidth();

    const modelRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { numberNotifyUnRead: totalNotify, notifies } =
      useAppSelector(selectNotify);
    const { unReadNumberMessage } = useAppSelector(selectMessage);
    const { conversations } = useAppSelector(selectConversation);
    const debounceValue = useDebounce(searchValue, 500);
    const { conversationId } = useParams();

    const handleLogout = async () => {
      setLoadingLogout(true);
      const res = await authService.logout();
      if (res.status === 200) {
        setLoadingLogout(false);
        navigate('/login');
      } else {
        dispatch(setIsError());
      }
    };

    const handleShowModel = () => {
      setShowModel(true);
    };

    // For responsive
    const handleOpen = () => {
      if (innerWidth >= 1024) {
        setIsOpen(!isOpen);
      }
      if (innerWidth <= 768) {
        setShowMobile(!showMobile);
      }
    };

    // Show search box
    const handleShowSearch = () => {
      if (innerWidth > 768) {
        setIsSearch(!isSearch);
      }
    };

    // Show modal create new group
    const handleClickCreateNewGroup = () => {
      const pathName = window.location.pathname;
      const path = pathName.split('/');
      if (path[1] === 'conversation') {
        setIsShowModelCreate(true);
      }
    };

    // Show all notify
    const handleShowNotify = () => {
      setShowNotification(!showNotification);
      if (totalNotify !== 0) {
        dispatch(readNotify(notifies[0]._id));
      }
    };

    const resetUnReadMessage = () => {
      if (unReadNumberMessage !== 0) {
        dispatch(resetUnReadNumberMessage());
      }
      if (!conversationId) {
        navigate(`/conversation/${Array.from(conversations.keys())[0]}`);
      }
    };

    // For responsive
    useEffect(() => {
      if (innerWidth < 1024) {
        setIsOpen(false);
      }
    }, [innerWidth]);

    // Search user
    useEffect(() => {
      const handleSearchUser = async () => {
        setIsLoading(true);
        const res = await userService.findUserByName(searchValue.trim());
        if (res.status === 200) {
          setUserSearch(res.data.metaData.users);
          setIsShowSearchModal(true);
        } else {
          dispatch(setIsError());
        }
        setIsLoading(false);
      };
      if (searchValue.trim() !== '') {
        handleSearchUser();
      }
    }, [debounceValue]);

    // Close result user was search
    useEffect(() => {
      if (searchValue.trim() === '') {
        setUserSearch([]);
        setIsShowSearchModal(false);
      }
    }, [searchValue]);

    useClickOutside(modelRef, () => setShowModel(false), 'mousedown');

    return (
      <div
        className={`${
          isOpen ? 'lg:pl-[250px] md:pl-[65px]' : 'md:pl-[65px]'
        } fixed top-0 w-full h-[76px] shadow-header duration-300 z-[100] bg-white`}
      >
        <div className='py-4 w-full px-4 sm:px-6 flex items-center justify-between h-full sm:grid grid-cols-12 '>
          <div className='col-span-2 sm:w-auto w-[10%] flex items-center gap-3 text-2xl font-medium text-black'>
            <span onClick={handleOpen} className='cursor-pointer'>
              <AiOutlineMenu />
            </span>
            <h1
              className={`${
                isOpen
                  ? 'lg:hidden xl:block'
                  : 'hidden sm:block md:hidden lg:block'
              } duration-300`}
            >
              Conversation
            </h1>
          </div>

          <div className='sm:col-span-3 w-[70%]'>
            {!isSearch && (
              <Search
                className={'sm:hidden'}
                width={'w-full'}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isShow={isShowSearchModal}
                setIsShow={setIsShowSearchModal}
                users={userSearch}
                isLoading={isLoading}
              />
            )}
          </div>

          <div
            className={`sm:col-span-7 sm:pl-6 flex items-center gap-4 justify-end w-[15%] sm:w-auto`}
          >
            <div className='hidden sm:flex items-center justify-center gap-[10px] xl:gap-3'>
              <div
                className='px-3 py-2 cursor-pointer flex items-center gap-2 bg-green-500 rounded-full'
                onClick={handleClickCreateNewGroup}
              >
                <span className='w-[20px] h-[20px] flex items-center justify-center text-green-500 bg-white rounded-full overflow-hidden'>
                  <AiOutlinePlus />
                </span>
                <span className='text-white text-sm'>New</span>
              </div>
              {isSearch && (
                <Search
                  className={'text-sm sm:text-base md:block hidden'}
                  width={'md:w-[280px] lg:w-[350px]'}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  isShow={isShowSearchModal}
                  setIsShow={setIsShowSearchModal}
                  users={userSearch}
                  isLoading={isLoading}
                />
              )}
              <div
                className='bg-gray-200 p-2 rounded-full cursor-pointer'
                onClick={handleShowSearch}
              >
                <IoSearch className='text-black text-xl' />
              </div>
              <div className='bg-gray-200 p-2 rounded-full cursor-pointer'>
                <BsBook className='text-black text-xl' />
              </div>
              <div className='relative'>
                <div
                  onClick={resetUnReadMessage}
                  className='bg-gray-200 p-2 rounded-full cursor-pointer'
                >
                  <RiMessengerLine className='text-black text-xl' />
                </div>
                <div
                  className={`absolute right-0 -top-[50%] ${
                    unReadNumberMessage === 0 && 'hidden'
                  } flex items-center justify-center translate-y-1/2 translate-x-1/2 min-w-[22px] min-h-[22px] bg-red-500 rounded-full`}
                >
                  <span className='text-sm text-white'>
                    {unReadNumberMessage > 5
                      ? `${unReadNumberMessage}+`
                      : unReadNumberMessage}
                  </span>
                </div>
              </div>
              <div className='relative'>
                <div
                  className='bg-gray-200 p-2 rounded-full cursor-pointer'
                  onClick={handleShowNotify}
                >
                  <IoNotificationsOutline className='text-black text-xl' />
                </div>
                <div
                  className={`absolute right-0 -top-[50%] ${
                    totalNotify === 0 && 'hidden'
                  } flex items-center justify-center translate-y-1/2 translate-x-1/2 min-w-[22px] min-h-[22px] bg-red-500 rounded-full`}
                >
                  <span className='text-sm text-white'>
                    {totalNotify > 5 ? `${totalNotify}+` : totalNotify}
                  </span>
                </div>
                <Notification
                  showNotification={showNotification}
                  setShowNotification={setShowNotification}
                />
              </div>
            </div>

            <span className='lg:p-1 xl:p-4 hidden sm:block'></span>

            <div onClick={handleShowModel} className='relative float-right'>
              <Avatar
                className={'w-[42px] h-[42px] min-h-[42px] min-w-[42px]'}
                avatarUrl={userLocal.avatarUrl}
              />
              <div
                ref={modelRef}
                className={`${
                  showModel ? 'block' : 'hidden'
                } absolute top-[calc(100%+6px)] right-0 bg-white shadow-default rounded-md overflow-hidden`}
              >
                <Button
                  text={'Logout'}
                  border={'border-none'}
                  paddingX={'px-6'}
                  paddingY={'py-2'}
                  hover={'hover:bg-gray-50 duration-300'}
                  onClick={() => setShowModelConfirm('true')}
                />
              </div>
            </div>
          </div>
        </div>
        {isShowModelCreate && (
          <CreateNewGroup
            isShowCreateNewGroup={isShowModelCreate}
            setShowCreateNewGroup={setIsShowModelCreate}
          />
        )}
        {showModelConfirm !== '' &&
          (loadingLogout ? (
            <LoadingScreen />
          ) : (
            <Confirm
              title={'Want to sign out?'}
              handleSave={handleLogout}
              isShow={showModelConfirm}
              setIsShow={setShowModelConfirm}
              textBtn={'Logout'}
            />
          ))}
      </div>
    );
  }
);

const Search: FC<IPopSearchBox> = ({
  className,
  width,
  height,
  searchValue,
  setSearchValue,
  isShow,
  setIsShow,
  users,
  isLoading,
}) => {
  const navigate = useNavigate();

  const handleClearSearchValue = () => {
    setSearchValue('');
  };
  const handleClickBox = (userId: string) => {
    if (setIsShow) setIsShow(false);
    setSearchValue('');
    navigate(`/profile/${userId}`, { preventScrollReset: true });
  };
  return (
    <div
      className={`${className} relative ${width ? width : 'w-[400px]'} ${
        height ? height : 'h-10'
      }  bg-[#f5f7f9] rounded-xl`}
    >
      <div className='flex items-center h-full gap-2 w-full px-[12px]'>
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          className='w-full pl-1 h-full bg-transparent border-none outline-none text-black'
          type='text'
          placeholder='Search...'
          value={searchValue}
        />
        {isLoading ? (
          <span className='flex items-center justify-center w-3 h-3 loading-spinner'></span>
        ) : (
          <span
            className={`${
              searchValue.trim() !== '' ? 'flex' : 'hidden'
            } items-center justify-center text-sm cursor-pointer`}
            onClick={handleClearSearchValue}
          >
            <AiOutlineClose />
          </span>
        )}
        <span className='flex items-center justify-center'>
          <IoSearch className='text-black text-xl' />
        </span>
      </div>

      <div
        className={`${isShow ? 'block' : 'hidden'}
      absolute overflow-auto top-12 w-full min-h-[320px] bg-white rounded-bl-md rounded-br-md shadow-default`}
      >
        {isLoading ? (
          <div className='min-h-[320px] flex items-center justify-center'>
            <Loading />
          </div>
        ) : users && users.length !== 0 ? (
          users?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleClickBox(user._id)}
              className='flex items-center hover:bg-slate-100 px-4 h-[70px] cursor-pointer'
            >
              <UserBox
                userName={getUsername(user)}
                avatarUrl={user.avatarUrl}
              />
            </div>
          ))
        ) : (
          <div className='flex items-center justify-center min-h-[320px] text-black'>
            <p>{`Can't find user with name ${searchValue}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
