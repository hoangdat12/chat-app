import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineFileImage, AiOutlineLike } from "react-icons/Ai";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaPushed } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import {
  MdAttachFile,
  MdNotificationsNone,
  MdOutlineArrowBack,
  MdOutlineVideoLibrary,
} from "react-icons/md";
import { TfiPin2 } from "react-icons/tfi";
import { VscTextSize } from "react-icons/vsc";
import Avatar from "../avatars/Avatar";
import { ButtonRounded } from "../../pages/conversation/Conversation";
import { CgProfile } from "react-icons/cg";

const ListDetail = [
  {
    SubMenu: {
      title: "Chat Detail",
      icon: <BsChevronDown />,
    },
    List: [{ title: "Pinned messages", icon: <TfiPin2 /> }],
  },
  {
    SubMenu: {
      title: "Custome conversation",
      icon: <BsChevronDown />,
    },
    List: [
      {
        title: "Change theme",
        icon: <FaPushed />,
      },
      {
        title: "Change emoji",
        icon: <AiOutlineLike />,
      },
      {
        title: "Change nick name",
        icon: <VscTextSize />,
      },
      {
        title: "Search in conversation",
        icon: <IoSearchSharp />,
      },
    ],
  },
  {
    SubMenu: {
      title: "Shared",
      icon: <BsChevronDown />,
    },
    List: [
      {
        title: "File",
        icon: <AiOutlineFileImage />,
      },
      {
        title: "Video",
        icon: <MdOutlineVideoLibrary />,
      },
      {
        title: "Link",
        icon: <MdAttachFile />,
      },
    ],
  },
];

export interface IPropConversationSetting {
  showMoreConversation?: boolean;
  setShowMoreConversation?: (value: boolean) => void;
}

const ConversationSetting: FC<IPropConversationSetting> = ({
  showMoreConversation,
  setShowMoreConversation,
}) => {
  const [show, setShow] = useState<number[]>([]);
  const modelRef = useRef<HTMLDivElement>(null);

  const handleShow = (idx: number) => {
    if (show.includes(idx)) {
      setShow((prev) => prev.filter((ele) => ele !== idx));
    } else {
      setShow((prev) => [...prev, idx]);
    }
  };

  useEffect(() => {
    if (showMoreConversation) {
      const clickOutSide = (e: MouseEvent) => {
        if (
          modelRef.current &&
          !modelRef.current?.contains(e.target as Node) &&
          setShowMoreConversation
        ) {
          setShowMoreConversation(false);
        }
      };

      document.addEventListener("mousedown", clickOutSide);

      return () => {
        document.removeEventListener("mousedown", clickOutSide);
      };
    }
  }, [showMoreConversation]);
  return (
    <div
      className={`${
        showMoreConversation
          ? "absolute top-0 right-0 flex flex-row-reverse bg-blackOverlay"
          : "block sm:hidden xl:block xl:col-span-3 py-6 border-[#f2f3f4]"
      } h-full w-full xl:border-l overflow-y-scroll sm:overflow-hidden scrollbar-hide`}
    >
      <div
        className={`${
          showMoreConversation &&
          "animate__animated animate__fadeInRight w-[350px] bg-[#f2f3f4] py-6"
        } relative`}
        ref={modelRef}
      >
        <div className='absolute top-0 left-4 flex sm:hidden'>
          <ButtonRounded
            className={"text-lg p-2"}
            icon={<MdOutlineArrowBack />}
            to={"/conversation/1"}
          />
        </div>
        <div className='flex flex-col items-center justify-center gap-3 cursor-pointer '>
          <div className=''>
            <Avatar
              className={"w-20 h-20"}
              avatarUrl={
                "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1"
              }
            />
          </div>
          <h1 className='text-2xl font-medium text-center font-poppins'>
            Hoang Dat
          </h1>
          <div className='flex gap-10 text-lg text-black'>
            <div className='relative'>
              <ButtonRounded icon={<CgProfile />} />
              <div className='absolute -bottom-6 left-[50%] -translate-x-1/2 text-sm'>
                Profile
              </div>
            </div>
            <div className='relative'>
              <ButtonRounded icon={<MdNotificationsNone />} />
              <div className='absolute -bottom-6 left-[50%] -translate-x-1/2 text-sm'>
                Notification
              </div>
            </div>
            <div className='relative'>
              <ButtonRounded icon={<IoSearchSharp />} />
              <div className='absolute -bottom-6 left-[50%] -translate-x-1/2 text-sm'>
                Search
              </div>
            </div>
          </div>
        </div>

        <ul className='mt-12 sm:max-h-[calc(100vh-20rem)] sm:overflow-y-scroll'>
          {ListDetail.map((element, idx) => (
            <li
              onClick={() => handleShow(idx)}
              className={`${idx === 0 ? "" : "mt-5"} px-8`}
              key={idx}
            >
              <div className='flex items-center justify-between cursor-pointer'>
                <a href='#' className='text-base'>
                  {element.SubMenu.title}
                </a>
                <span
                  className={`${
                    show.includes(idx)
                      ? "animate__animated animate__rotateIn"
                      : ""
                  }`}
                >
                  {show.includes(idx) ? <BsChevronUp /> : <BsChevronDown />}
                </span>
              </div>
              <ul
                className={`${
                  show.includes(idx) ? "block" : " hidden"
                } px-2 text-base font-light`}
              >
                {element.List.map((item, index) => (
                  <li
                    className='flex items-center gap-2 mt-3 cursor-pointer'
                    key={index}
                  >
                    <span>{item.icon}</span>
                    <a
                      href=''
                      className='whitespace-nowrap overflow-hidden text-ellipsis'
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConversationSetting;
