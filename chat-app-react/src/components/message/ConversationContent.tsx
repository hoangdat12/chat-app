// import { Link } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";

import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { BsPinAngle } from "react-icons/bs";
import { MdAttachFile, MdOutlineArrowBack } from "react-icons/md";
import { AiOutlineFileImage, AiOutlinePlusCircle } from "react-icons/Ai";

import Avatar from "../avatars/Avatar";
import { ButtonRounded } from "../../pages/conversation/Conversation";
import MyMessage, { OtherMessage } from "./Message";
import useInnerWidth from "../../hooks/useInnterWidth";
// import { io } from "socket.io-client";
import myAxios from "../../ultils/myAxios";
import {
  IConversation,
  IParticipant,
  createNewMessageOfConversation,
} from "../../features/conversation/conversationSlice";
import { IUser } from "../../features/auth/authSlice";
import {
  IMessage,
  selectMessage,
  fetchMessageOfConversation as fetchMessage,
  createNewMessage,
} from "../../features/message/messageSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";

export interface IPropConversationContent {
  user: IUser | null;
  conversation: IConversation | null;
  setShowMoreConversation?: (value: boolean) => void;
  showMoreConversation?: boolean;
}

export interface IPropContent {
  user: IUser | null;
  messages: IMessage[];
}

const ConversationContent: FC<IPropConversationContent> = ({
  conversation,
  user,
  setShowMoreConversation,
  showMoreConversation,
}) => {
  const [messageValue, setMessageValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const innterWidth = useInnerWidth();

  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector(selectMessage);

  const handleSendMessage = async () => {
    if (conversation) {
      const body = {
        message_type: conversation?.conversation_type,
        message_content: messageValue,
        conversationId: conversation?._id,
      };
      const res = await myAxios.post("/message", body);
      if (res.data.status === 200) {
        dispatch(createNewMessage(res.data.metaData));
        const dataUpdate = {
          lastMessage: res.data.metaData.message_content,
          lastMessageSendAt: res.data.metaData.createdAt,
          conversation,
        };
        dispatch(createNewMessageOfConversation(dataUpdate));
        setMessageValue("");
        inputRef.current?.focus();
      }
    }
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

  useEffect(() => {
    if (conversation) {
      const data = {
        conversation_type: conversation.conversation_type,
        conversationId: conversation._id,
      };
      dispatch(fetchMessage(data));
    }
  }, [conversation]);

  // useEffect(() => {
  //   const socket = io("http://localhost:8080", {
  //     withCredentials: true,
  //   });
  //   socket.on("connection", (data) => console.log(data));

  //   return () => {
  //     socket.off("UnConnected!");
  //   };
  // }, []);

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

      <div className='max-h-[calc(100vh-13rem)] sm:max-h-[calc(100vh-15rem)] w-full mt-1 flex flex-col-reverse h-full px-4 sm:px-6 py-4 overflow-y-scroll'>
        {isLoading ? (
          <div>
            <span className='loading-spinner'></span>
          </div>
        ) : (
          <Content user={user} messages={messages} />
        )}
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

export interface IDataFormatMessage {
  user: IParticipant;
  messages: IMessage[];
  myMessage: boolean;
}

export const Content: FC<IPropContent> = ({ messages, user }) => {
  const formatMessage: IDataFormatMessage[] = [];
  if (messages?.length) {
    let currentUser = messages[0].message_sender_by;
    let messageOfUser: IMessage[] = [messages[0]];

    for (let i = 1; i < messages.length; i++) {
      const lastUser = messages[i]?.message_sender_by;
      const { userId } = currentUser || {};

      if (userId === lastUser?.userId) {
        messageOfUser.push(messages[i]);
      } else {
        const data: IDataFormatMessage = {
          user: currentUser,
          messages: messageOfUser,
          myMessage: user?._id === userId,
        };
        formatMessage.push(data);
        currentUser = messages[i]?.message_sender_by;
        messageOfUser = [messages[i]];
      }
    }
    const { userId } = currentUser || {};
    const data: IDataFormatMessage = {
      user: currentUser,
      messages: messageOfUser,
      myMessage: user?._id === userId,
    };
    formatMessage.push(data);
  }
  return (
    <>
      {formatMessage?.map((message, idx) => {
        return (
          <div key={idx}>
            {message.myMessage ? (
              <>
                <MyMessage
                  // className={"hidden sm:flex"}
                  contents={message.messages}
                />
              </>
            ) : (
              <>
                <OtherMessage
                  // className={"hidden sm:flex"}
                  avatarUrl={
                    "https://freenice.net/wp-content/uploads/2021/08/hinh-anh-avatar-dep.jpg"
                  }
                  contents={message.messages}
                />
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ConversationContent;
