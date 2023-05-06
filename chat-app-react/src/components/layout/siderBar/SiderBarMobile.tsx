import { FC, useRef, useEffect } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/Ai";
import "animate.css";
import { selectNav1, selectNavUtils } from "./SiderBar";
import { Link } from "react-router-dom";
import { AvatarSquare } from "../../avatars/Avatar";
import LogoPage from "../../../assets/Logo2.png";

export interface IPropSiderBarMobile {
  className?: string;
  showMobile: boolean;
  setShowMobile: (showMobile: boolean) => void;
}

const SiderBarMobile: FC<IPropSiderBarMobile> = ({
  className,
  showMobile,
  setShowMobile,
}) => {
  const siderBarMobileRef = useRef<HTMLDivElement>(null);

  const handleCloseSiderBar = () => {
    setShowMobile(false);
  };

  useEffect(() => {
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
  }, [showMobile]);

  return (
    <div
      className={`${className} animate__animated w-[80%] h-screen fixed top-0 left-0 bg-black text-white`}
      ref={siderBarMobileRef}
    >
      <div
        className='absolute top-4 right-4 font-bold text-2xl'
        onClick={handleCloseSiderBar}
      >
        <AiOutlineClose />
      </div>
      <div>
        <div
          className={`flex gap-3 items-center mb-6 duration-300 whitespace-nowrap px-2 `}
        >
          <span>
            <AvatarSquare
              avatarUrl={LogoPage}
              className={`w-[49px] h-[49px] duration-300 whitespace-nowrap animate__bounceIn`}
            />
          </span>
          <div className={`whitespace-nowrap duration-300`}>
            <h1 className='text-xl'>Fasty</h1>
            <h2 className='text-sm'>Easy your life</h2>
          </div>
        </div>
        <ul className='list'>
          {selectNav1.map((select, index) => (
            <li
              key={index}
              className={`selectorNav show_element flex justify-between items-center w-full h-[44px] relative hover:bg-blue-700`}
            >
              <div>
                <Link
                  className='link whitespace-nowrap overflow-hidden visible'
                  to='/'
                >
                  <i className='w-16 flex justify-center whitespace-nowrap'>
                    {select.icons}
                  </i>
                  <span className='font-medium text-base whitespace-nowrap'>
                    {select.display}
                  </span>
                </Link>
                <span
                  className={`absolute element hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
                >
                  {select.display}
                </span>
              </div>
              {/* <span className='mr-4 text-[12px] bg-blue-300 p-[2px] rounded'>
                  X1
                </span> */}
            </li>
          ))}
        </ul>
        <hr className='my-[20px] mx-4' />
        <div className={`justify-between flex px-4 text-base duration-300`}>
          <h2 className='text-[#ebe4e4]'>Relax</h2>
          <span className='cursor-pointer'>
            <AiOutlinePlus />
          </span>
        </div>
        <ul className='list'>
          {selectNavUtils.map((select, index) => (
            <li
              key={index}
              className={`selectorNav show_element flex items-center w-full h-[44px] relative hover:bg-blue-700`}
            >
              <Link className='link whitespace-nowrap overflow-hidden' to='/'>
                <i className='select__icon w-16 flex justify-center whitespace-nowrap'>
                  {select.icons}
                </i>
                <span className='font-medium text-base whitespace-nowrap'>
                  {select.display}
                </span>
              </Link>
              <span
                className={`absolute element hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4 min-h-[44px] min-w-[120px] bg-blue-700`}
              >
                {select.display}
              </span>
            </li>
          ))}
        </ul>

        <hr className='my-[20px] mx-4' />
        <div className={`justify-between flex px-4 text-base duration-300`}>
          <h2 className='text-[#ebe4e4]'>Utils</h2>
          <span className='cursor-pointer'>
            <AiOutlinePlus />
          </span>
        </div>
        <ul className='list'>
          {selectNavUtils.map((select, index) => (
            <li
              key={index}
              className={`selectorNav show_element flex items-center w-full h-[44px] relative hover:bg-blue-700`}
            >
              <Link className='link whitespace-nowrap overflow-hidden' to='/'>
                <i className='select__icon w-16 flex justify-center whitespace-nowrap'>
                  {select.icons}
                </i>
                <span className='font-medium text-base whitespace-nowrap'>
                  {select.display}
                </span>
              </Link>
              <span
                className={`absolute element hidden opacity-0 items-center justify-center rounded-tr-md rounded-br-md cursor-pointer left-[100%] top-0 z-20 px-4  min-h-[44px] min-w-[120px] bg-blue-700`}
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

export default SiderBarMobile;
