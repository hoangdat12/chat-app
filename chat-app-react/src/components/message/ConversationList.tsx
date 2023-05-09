import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Avatar, { AvatarSquare } from "../avatars/Avatar";
import Search from "../search/Search";
import ConversationInfor, {
  ConversationInforMobile,
} from "./ConversationInfor";
import LogoPage from "../../assets/Logo2.png";
import { IUser } from "../../features/auth/authSlice";
import {
  fetchConversationOfUser,
  selectConversation,
} from "../../features/conversation/conversationSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";

export interface IPropConversationList {
  // Active Link or not
  to?: boolean;
}

const userJson = localStorage.getItem("user");
const user = userJson ? (JSON.parse(userJson) as IUser) : null;

const ConversationList: FC<IPropConversationList> = ({ to }) => {
  const [active, setActive] = useState(0);

  const ditpatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);

  console.log(conversations);

  const handleActive = (idx: number) => {
    setActive(idx);
  };

  useEffect(() => {
    const fetchListConversationOfUser = async () => {
      ditpatch(fetchConversationOfUser(user?._id ? user?._id : " "));
    };

    fetchListConversationOfUser();
  }, []);

  return (
    <div className='xl:col-span-3 md:col-span-4 w-full sm:w-[80px] md:w-auto bg-[#f2f3f4] h-full py-6 sm:py-8 overflow-hidden'>
      <div className='flex justify-center px-4'>
        <Search
          className={"bg-white flex sm:hidden md:flex"}
          width={"w-full"}
        />
        <AvatarSquare
          avatarUrl={LogoPage}
          className={`hidden sm:block md:hidden w-10 h-10 duration-300 whitespace-nowrap animate__bounceIn `}
        />
      </div>

      <div className='flex sm:hidden gap-3 my-4 mx-6 overflow-x-scroll scrollbar-hide'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ele) => (
          <div className='relative' key={ele}>
            <Avatar
              className={"h-12 w-12"}
              avatarUrl={
                "https://i.pinimg.com/originals/2b/0f/7a/2b0f7a9533237b7e9b49f62ba73b95dc.jpg"
              }
            />
            <span className='absolute bottom-[2px] right-0 p-[6px] bg-green-500 rounded-full'></span>
          </div>
        ))}
      </div>

      <div className='max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-10.5rem)] scrollbar-hide mt-4 border-t border-[#e8ebed] overflow-y-scroll'>
        {conversations.map((conversation, idx) => {
          let name = null;
          let avatarUrl = null;

          let lastMessage = conversation.lastMessage;
          if (conversation.conversation_type === "group") {
            name = conversation.nameGroup ?? "Name Group";
            avatarUrl = conversation.participants[0].avatarUrl;
          } else {
            conversation.participants.map((participant) => {
              if (participant.userId !== user?._id) {
                name = participant.firstName + " " + participant.lastName;
                avatarUrl = participant.avatarUrl;
              }
            });
          }
          return (
            <>
              <Link
                to={to ? "/conversation/1" : "#"}
                key={`${conversation._id}1`}
                className={`block sm:hidden md:block cursor-pointer ${
                  idx === active && "bg-white"
                }`}
                onClick={() => handleActive(idx)}
              >
                <ConversationInfor
                  active={idx === active}
                  avatarUrl={
                    avatarUrl ??
                    "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1"
                  }
                  nickName={name ?? "undifined"}
                  status={"Active"}
                  lastMessage={lastMessage}
                />
              </Link>
              <div
                key={`${conversation._id}10`}
                className={`hidden sm:block md:hidden cursor-pointer ${
                  idx === active && "bg-white"
                } w-full border-b-[2px] border-[#e8ebed]`}
                onClick={() => handleActive(idx)}
              >
                <div className='flex justify-center'>
                  <ConversationInforMobile
                    avatarUrl={
                      avatarUrl ??
                      "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1"
                    }
                  />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
