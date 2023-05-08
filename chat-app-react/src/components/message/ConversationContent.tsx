import { Link } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";

import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { BsPinAngle } from "react-icons/bs";
import { MdAttachFile, MdOutlineArrowBack } from "react-icons/md";
import { AiOutlineFileImage, AiOutlinePlusCircle } from "react-icons/Ai";

import Avatar from "../avatars/Avatar";
import { ButtonRounded } from "../../pages/conversation/Conversation";
import MyMessage, {
  MyMessageMobile,
  OtherMessage,
  OtherMessageMobile,
} from "./Message";
import useInnerWidth from "../../hooks/useInnterWidth";

export interface IPropConversationContent {
  setShowMoreConversation?: (value: boolean) => void;
  showMoreConversation?: boolean;
}

const ConversationContent: FC<IPropConversationContent> = ({
  setShowMoreConversation,
  showMoreConversation,
}) => {
  const [messageValue, setMessageValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const innterWidth = useInnerWidth();

  const handleSendMessage = () => {
    console.log(messageValue);
    setMessageValue("");
    inputRef.current?.focus();
  };

  const handleChangeMessageValue = (e: any) => {
    setMessageValue(e.target.value);
  };

  const handleShowMoreConversation = () => {
    if (setShowMoreConversation && innterWidth < 1280 && innterWidth >= 640) {
      setShowMoreConversation(!showMoreConversation);
    }
  };

  useEffect(() => {
    if (messageValue !== "") {
      const enterEvent = (e: any) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          handleSendMessage();
        }
      };

      document.addEventListener("keydown", enterEvent);

      return () => {
        document.removeEventListener("keydown", enterEvent);
      };
    }
  }, [messageValue]);

  return (
    <div className='block xl:col-span-6 md:col-span-8 w-full h-full'>
      <div className='flex items-center justify-between h-16 sm:h-[5.5rem] px-4 sm:px-8 w-full shadow-nomal'>
        <div className='mr-2 block sm:hidden'>
          <ButtonRounded
            className={"text-base p-1"}
            icon={<MdOutlineArrowBack />}
            to='/conversation'
          />
        </div>
        <div className='flex w-full gap-3 cursor-pointer '>
          <div className=''>
            <Avatar
              className={"sm:w-14 sm:h-14 h-12 w-12"}
              avatarUrl={
                "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1"
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
          <ButtonRounded className={"hidden sm:flex"} icon={<BsPinAngle />} />
          <ButtonRounded
            className={"text-base p-1 sm:text-[22px] sm:p-2"}
            icon={<IoCallOutline />}
          />
          <ButtonRounded
            className={"text-base p-1 sm:text-[22px] sm:p-2"}
            icon={<IoVideocamOutline />}
          />
          <ButtonRounded
            className={"text-base p-1 sm:text-[22px] sm:p-2"}
            icon={<IoIosInformationCircleOutline />}
            onClick={handleShowMoreConversation}
            to='/conversation/setting'
          />
        </div>
      </div>

      <div className='max-h-[calc(100vh-13rem)] sm:max-h-[calc(100vh-15rem)] mt-1 flex flex-col-reverse h-full px-4 sm:px-6 py-4 overflow-y-scroll'>
        {/* > Tablet */}
        <MyMessage
          className={"hidden sm:flex"}
          contents={["Unformately not"]}
        />
        <OtherMessage
          className={"hidden sm:flex"}
          avatarUrl={
            "https://freenice.net/wp-content/uploads/2021/08/hinh-anh-avatar-dep.jpg"
          }
          contents={["Hi", "How about your Interview?", "Have you pass it!"]}
        />
        {/* // Mobile */}
        <div className='mt-3'>
          <MyMessageMobile
            className={"flex sm:hidden"}
            contents={["Unformately not"]}
          />
        </div>
        <div className='mt-3'>
          <OtherMessageMobile
            className={"flex sm:hidden"}
            avatarUrl={
              "https://freenice.net/wp-content/uploads/2021/08/hinh-anh-avatar-dep.jpg"
            }
            contents={["Hi", "How about your Interview?", "Have you pass it!"]}
          />
        </div>
      </div>

      <div className='flex items-center gap-3 sm:gap-4 h-16 sm:h-20 px-2 sm:px-6 '>
        <div className='flex gap-2 text-blue-500'>
          <ButtonRounded
            className={"text-base p-1 sm:text-[22px] sm:p-2"}
            icon={<AiOutlinePlusCircle />}
          />
          <ButtonRounded
            className={"text-base p-1 sm:text-[22px] sm:p-2"}
            icon={<MdAttachFile />}
          />
          <ButtonRounded
            className={"text-base p-1 sm:text-[22px] sm:p-2"}
            icon={<AiOutlineFileImage />}
          />
        </div>
        <div className='flex items-center gap-2 sm:gap-4 pl-4 w-full bg-[#f2f3f4] overflow-hidden rounded-xl'>
          <input
            type='text'
            value={messageValue}
            onChange={(e) => handleChangeMessageValue(e)}
            ref={inputRef}
            placeholder='Enter your message...'
            className='text-sm sm:text-base font-medium w-full py-2 outline-none bg-transparent'
          />
          <button
            className='py-2 px-2 sm:px-4 text-sm sm:text-base text-white rounded-xl bg-blue-500'
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationContent;
