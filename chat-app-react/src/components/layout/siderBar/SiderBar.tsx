import { Link } from 'react-router-dom';
import { FC, useEffect, useRef } from 'react';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/Ai';

import AvatarSquare from '../../avatars/AvatarSquare';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import {
  getFirstConversation,
  selectConversation,
} from '../../../features/conversation/conversationSlice';
import useInnerWidth from '../../../hooks/useInnterWidth';
import LogoPage from '../../../assets/Logo2.png';

import './siderBar.scss';
import {
  selectNav1,
  selectNav2,
  selectNavExplore,
  selectNavUtils,
} from '../../../ultils/list/siderBar.list';

export interface IPropSiderBar {
  isOpen: boolean;
  showMobile: boolean;
  setShowMobile: (showMobile: boolean) => void;
}

const SiderBar: FC<IPropSiderBar> = ({ isOpen, showMobile, setShowMobile }) => {
  const siderBarMobileRef = useRef<HTMLDivElement>(null);
  const { firstConversation } = useAppSelector(selectConversation);
  const dispatch = useAppDispatch();
  const innerWitdh = useInnerWidth();

  const handleCloseSiderBar = () => {
    setShowMobile(false);
  };

  // getFirstConversation
  useEffect(() => {
    dispatch(getFirstConversation());
  }, []);

  // Handle mousedown close sidebar mobile
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

      window.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMobile]);
  // bg-[#1a1451]
  return (
    <div
      className={
        showMobile
          ? 'w-full h-screen fixed top-0 left-0 bg-blackOverlay text-white  z-[1000]'
          : `navbar ${
              isOpen ? 'w-[250px] ' : 'w-[65px] overflow-visible'
            }  fixed h-screen duration-300 text-white bg-blue-500 pt-[18px] pb-2 md:block hidden z-[1000]`
      }
    >
      <div
        className={`navbar__menu relative flex flex-col justify-between h-full ${
          showMobile
            ? 'w-[80%] bg-[#1a1451] animate__animated animate__fadeInLeft'
            : 'animate__fadeOutLeft'
        } ${!isOpen && 'close'} ${showMobile && 'py-4'}`}
        ref={siderBarMobileRef}
      >
        <div>
          <div
            className={`flex gap-3 items-center mb-6 duration-300 whitespace-nowrap px-2 ${
              isOpen && 'pl-4'
            } ${showMobile && 'hidden'}`}
          >
            <span>
              <AvatarSquare
                avatarUrl={LogoPage}
                className={`w-[49px] h-[49px] duration-300 whitespace-nowrap animate__bounceIn ${
                  !isOpen && 'border-2 border-[#cac6f0]'
                } `}
              />
            </span>
            <div
              className={`${
                isOpen ? 'block' : 'hidden'
              } whitespace-nowrap duration-300`}
            >
              <h1 className='text-xl'>Fasty</h1>
              <h2 className='text-sm'>Easy your life</h2>
            </div>
          </div>

          <div className={`${!showMobile && 'hidden'} flex mb-4`}>
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
                  showMobile ? 'h-[50px]' : 'md:h-[44px]'
                } relative hover:bg-blue-700`}
              >
                <Link
                  className={`link whitespace-nowrap overflow-hidden  w-full ${
                    showMobile ? 'text-base sm:text-lg' : 'text-base'
                  }`}
                  to={`${
                    select.display === 'Messages'
                      ? innerWitdh < 640
                        ? '/conversation/all/list'
                        : `${select.path}/${firstConversation?._id}`
                      : select.path
                  }`}
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
                    !showMobile && 'element'
                  } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-[1000] px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
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
                ? 'opacity-100 overflow-auto h-auto'
                : 'opacity-0 overflow-hidden h-0'
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
                className={`relative selectorNav show_element flex items-center w-full ${
                  showMobile ? 'h-[50px]' : 'md:h-[44px]'
                } relative hover:bg-blue-700`}
              >
                <Link
                  className={`link whitespace-nowrap overflow-hidden  w-full ${
                    showMobile ? 'text-base sm:text-lg' : 'text-base'
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
                    !showMobile && 'element'
                  } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-[1000] px-4 min-h-[44px] min-w-[120px] bg-blue-700`}
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
                ? 'opacity-100 overflow-auto h-auto'
                : 'opacity-0 overflow-hidden h-0'
            } justify-between flex px-4 text-base duration-300`}
          >
            <h2 className='text-[#ebe4e4]'>Explore</h2>
            <span className='cursor-pointer'>
              <AiOutlinePlus />
            </span>
          </div>
          <ul className='list'>
            {selectNavExplore.map((select, index) => (
              <li
                key={index}
                className={`selectorNav show_element flex items-center w-full ${
                  showMobile ? 'h-[50px]' : 'md:h-[44px]'
                } relative hover:bg-blue-700`}
              >
                <Link
                  className={`link whitespace-nowrap overflow-hidden  w-full ${
                    showMobile ? 'text-base sm:text-lg' : 'text-base'
                  }`}
                  to={select.path}
                  target={select.display === 'Github' ? '_blank' : ''}
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
                    !showMobile && 'element'
                  } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-[1000] px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
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
                showMobile ? 'h-[50px]' : 'md:h-[44px]'
              } relative hover:bg-blue-700`}
            >
              <Link
                className={`link whitespace-nowrap overflow-hidden w-full ${
                  showMobile ? 'text-base sm:text-lg' : 'text-base'
                }`}
                to={select.path}
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
                  !showMobile && 'element'
                } hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-[1000] px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
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
