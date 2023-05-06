import { Link } from "react-router-dom";
import { FC, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineHome, AiOutlinePlus } from "react-icons/Ai";
import { FiSend, FiSettings } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { AvatarSquare } from "../../avatars/Avatar";

import LogoPage from "../../../assets/Logo2.png";
import "./SiderBar.scss";
import {
  IoGameControllerOutline,
  IoHelpBuoyOutline,
  IoMusicalNotesOutline,
} from "react-icons/io5";

export const selectNav1 = [
  {
    display: "NewsFeed",
    path: "/home",
    icons: <AiOutlineHome />,
  },
  {
    display: "Messenges",
    path: "/messenges/3/5",
    icons: <FiSend />,
  },
  {
    display: "Profile",
    path: "/profile",
    icons: <BsPerson />,
  },
  // {
  //   display: "Friends",
  //   path: "/friends",
  //   icons: <RiGitRepositoryPrivateLine />,
  // },
];

export const selectNavUtils = [
  {
    display: "Games",
    path: "/setting/general",
    icons: <IoGameControllerOutline />,
  },
  {
    display: "Music",
    path: "/page/login",
    icons: <IoMusicalNotesOutline />,
  },
];

const selectNav2 = [
  {
    display: "Setting",
    path: "/setting/general",
    icons: <FiSettings />,
  },
  {
    display: "Help",
    path: "/page/login",
    icons: <IoHelpBuoyOutline />,
  },
  // {
  //   display: "Logout",
  //   path: "/page/login",
  //   icons: <RiLogoutCircleRLine />,
  // },
];

export interface IPropSiderBar {
  isOpen: boolean;
  showMobile: boolean;
  setShowMobile: (showMobile: boolean) => void;
}

const SiderBar: FC<IPropSiderBar> = ({ isOpen, showMobile, setShowMobile }) => {
  const siderBarMobileRef = useRef<HTMLDivElement>(null);

  const handleCloseSiderBar = () => {
    setShowMobile(false);
  };

  useEffect(() => {
    if (!isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          siderBarMobileRef.current &&
          !siderBarMobileRef.current.contains(e.target as Node)
        ) {
          setShowMobile(false);
        }
      };

      if (showMobile) {
        siderBarMobileRef.current?.classList.add("animate__fadeInLeft");
        siderBarMobileRef.current?.classList.remove("animate__fadeOutLeft");
      } else {
        siderBarMobileRef.current?.classList.add("animate__fadeOutLeft");
        siderBarMobileRef.current?.classList.remove("animate__fadeInLeft");
      }

      window.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMobile]);

  return (
    <div
      className={
        showMobile
          ? "animate__animated w-[80%] h-screen fixed top-0 left-0 bg-[#1a1451] text-white"
          : `navbar ${
              isOpen ? "w-[250px] " : "w-[65px] overflow-visible"
            }  fixed h-screen duration-300 text-white bg-blue-500 pt-[18px] pb-2 md:block hidden`
      }
      ref={siderBarMobileRef}
    >
      <div
        className={`navbar__menu h-full flex flex-col justify-between ${
          !isOpen && "close"
        } ${showMobile && "py-4"}`}
      >
        <div>
          <div
            className={`flex gap-3 items-center mb-6 duration-300 whitespace-nowrap px-2 ${
              isOpen && "pl-4"
            } ${showMobile && "hidden"}`}
          >
            <span>
              <AvatarSquare
                avatarUrl={LogoPage}
                className={`w-[49px] h-[49px] duration-300 whitespace-nowrap animate__bounceIn ${
                  !isOpen && "border-2 border-[#cac6f0]"
                } `}
              />
            </span>
            <div
              className={`${
                isOpen ? "block" : "hidden"
              } whitespace-nowrap duration-300`}
            >
              <h1 className='text-xl'>Fasty</h1>
              <h2 className='text-sm'>Easy your life</h2>
            </div>
          </div>

          <div className={`${!showMobile && "hidden"} flex mb-4`}>
            <h1 className='text-2xl pl-8'>Fasty</h1>
            <span
              className='absolute top-4 right-4 font-bold text-2xl'
              onClick={handleCloseSiderBar}
            >
              <AiOutlineClose />
            </span>
          </div>

          <ul className='list'>
            {selectNav1.map((select, index) => (
              <li
                key={index}
                className={`selectorNav show_element flex items-center w-full ${
                  showMobile ? "h-[50px]" : "md:h-[44px]"
                } relative hover:bg-blue-700`}
              >
                <Link
                  className={`link whitespace-nowrap overflow-hidden ${
                    showMobile ? "text-base sm:text-lg" : "text-base"
                  }`}
                  to='/'
                >
                  <i className='w-16 flex justify-center whitespace-nowrap'>
                    {select.icons}
                  </i>
                  <span className='font-medium whitespace-nowrap'>
                    {select.display}
                  </span>
                </Link>
                <span
                  className={`absolute ${
                    !showMobile && "element"
                  } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
                >
                  {select.display}
                </span>
              </li>
            ))}
          </ul>

          <hr className='my-5 mx-4' />
          <div
            className={`${
              isOpen
                ? "opacity-100 overflow-auto h-auto"
                : "opacity-0 overflow-hidden h-0"
            } justify-between flex px-4 text-base duration-300`}
          >
            <h2 className='text-[#ebe4e4]'>Relax</h2>
            <span className='cursor-pointer'>
              <AiOutlinePlus />
            </span>
          </div>
          <ul className='list'>
            {selectNavUtils.map((select, index) => (
              <li
                key={index}
                className={`selectorNav show_element flex items-center w-full ${
                  showMobile ? "h-[50px]" : "md:h-[44px]"
                } relative hover:bg-blue-700`}
              >
                <Link
                  className={`link whitespace-nowrap overflow-hidden ${
                    showMobile ? "text-base sm:text-lg" : "text-base"
                  }`}
                  to='/'
                >
                  <i className='select__icon w-16 flex justify-center whitespace-nowrap'>
                    {select.icons}
                  </i>
                  <span className='font-medium whitespace-nowrap'>
                    {select.display}
                  </span>
                </Link>
                <span
                  className={`absolute ${
                    !showMobile && "element"
                  } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4 min-h-[44px] min-w-[120px] bg-blue-700`}
                >
                  {select.display}
                </span>
              </li>
            ))}
          </ul>

          <hr className='my-5 mx-4' />
          <div
            className={`${
              isOpen
                ? "opacity-100 overflow-auto h-auto"
                : "opacity-0 overflow-hidden h-0"
            } justify-between flex px-4 text-base duration-300`}
          >
            <h2 className='text-[#ebe4e4]'>Utils</h2>
            <span className='cursor-pointer'>
              <AiOutlinePlus />
            </span>
          </div>
          <ul className='list'>
            {selectNavUtils.map((select, index) => (
              <li
                key={index}
                className={`selectorNav show_element flex items-center w-full ${
                  showMobile ? "h-[50px]" : "md:h-[44px]"
                } relative hover:bg-blue-700`}
              >
                <Link
                  className={`link whitespace-nowrap overflow-hidden ${
                    showMobile ? "text-base sm:text-lg" : "text-base"
                  }`}
                  to='/'
                >
                  <i className='select__icon w-16 flex justify-center whitespace-nowrap'>
                    {select.icons}
                  </i>
                  <span className='font-medium whitespace-nowrap'>
                    {select.display}
                  </span>
                </Link>
                <span
                  className={`absolute ${
                    !showMobile && "element"
                  } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
                >
                  {select.display}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className='list'>
          {selectNav2.map((select, index) => (
            <li
              key={index}
              className={`selectorNav show_element flex items-center w-full ${
                showMobile ? "h-[50px]" : "md:h-[44px]"
              } relative hover:bg-blue-700`}
            >
              <Link
                className={`link whitespace-nowrap overflow-hidden ${
                  showMobile ? "text-base sm:text-lg" : "text-base"
                }`}
                to='/'
              >
                <i className='select__icon w-16 flex justify-center whitespace-nowrap'>
                  {select.icons}
                </i>
                <span className='font-medium whitespace-nowrap'>
                  {select.display}
                </span>
              </Link>
              <span
                className={`absolute ${
                  !showMobile && "element"
                } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
              >
                {select.display}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SiderBar;
