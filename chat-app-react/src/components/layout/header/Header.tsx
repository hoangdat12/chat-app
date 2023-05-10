import { useEffect } from "react";

import {
  IoGameControllerOutline,
  IoSearch,
  IoNotificationsOutline,
} from "react-icons/io5";

import { AiOutlineMenu, AiOutlinePlus } from "react-icons/Ai";
import { BsBook } from "react-icons/bs";
import { FC, useState } from "react";

import Avatar from "../../avatars/Avatar";
import useInnerWidth from "../../../hooks/useInnterWidth";
import Search from "../../search/Search";
import CreateNewGroup from "../../message/CreateNewGroup";

export interface IPropHeader {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showMobile: boolean;
  setShowMobile: (showMobile: boolean) => void;
}

const Header: FC<IPropHeader> = ({
  setIsOpen,
  isOpen,
  setShowMobile,
  showMobile,
}) => {
  const [isSearch, setIsSearch] = useState(false);
  const [isShowModelCreate, setIsShowModelCreate] = useState(false);
  const innerWidth = useInnerWidth();

  useEffect(() => {
    if (innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [innerWidth]);

  const handleOpen = () => {
    if (innerWidth >= 1024) {
      console.log(isOpen);
      setIsOpen(!isOpen);
    }
    if (innerWidth <= 768) {
      setShowMobile(!showMobile);
    }
  };

  const handleShowSearch = () => {
    if (innerWidth >= 768) {
      setIsSearch(!isSearch);
    }
  };

  const handleClickCreateNewGroup = () => {
    const pathName = window.location.pathname;
    const path = pathName.split("/");
    if (path[1] === "conversation") {
      setIsShowModelCreate(true);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "lg:pl-[250px] md:pl-[65px]" : "md:pl-[65px]"
      } fixed top-0 w-full h-[76px] shadow-header duration-300 z-[1000]`}
    >
      <div className='py-4 w-full px-4 sm:px-6 flex items-center justify-between h-full sm:grid grid-cols-12 '>
        <div className='col-span-2 sm:w-auto w-[10%] flex items-center gap-3 text-2xl font-medium text-black'>
          <span onClick={handleOpen} className='cursor-pointer'>
            <AiOutlineMenu />
          </span>
          <h1
            className={`${
              isOpen ? "lg:hidden xl:block" : "hidden sm:block"
            } duration-300`}
          >
            Conversation
          </h1>
        </div>

        <div className='sm:col-span-3 w-[70%]'>
          <Search
            className={"sm:hidden text-sm sm:text-base"}
            width={"w-full"}
          />
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
            <div
              className={`${
                isSearch ? "flex" : "hidden"
              } bg-[#f5f7f9] flex w-[320px] xl:w-[400px] rounded-xl h-10`}
            >
              <input
                className='w-[90%] h-full bg-transparent border-none outline-none px-4 text-black'
                type='text'
                placeholder='Search...'
              />
            </div>
            <div
              className='bg-gray-200 p-2 rounded-full cursor-pointer'
              onClick={handleShowSearch}
            >
              <IoSearch className='text-black text-xl' />
            </div>
            <div className='bg-gray-200 p-2 rounded-full cursor-pointer'>
              <BsBook className='text-black text-xl' />
            </div>
            <div className='bg-gray-200 p-2 rounded-full cursor-pointer'>
              <IoGameControllerOutline className='text-black text-xl' />
            </div>
            <div className='bg-gray-200 p-2 rounded-full cursor-pointer'>
              <IoNotificationsOutline className='text-black text-xl' />
            </div>
          </div>

          <span className='lg:p-1 xl:p-4 hidden sm:block'></span>

          <div className='float-right'>
            <Avatar
              className={" w-[42px] h-[42px]"}
              avatarUrl={
                "https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg"
              }
            />
          </div>
        </div>
      </div>
      <CreateNewGroup
        isShowCreateNewGroup={isShowModelCreate}
        setShowCreateNewGroup={setIsShowModelCreate}
      />
    </div>
  );
};

export default Header;
