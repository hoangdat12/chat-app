import { FC, useState } from "react";
import { Link } from "react-router-dom";

import Avatar, { AvatarSquare } from "../avatars/Avatar";
import Search from "../search/Search";
import ConversationInfor, {
  ConversationInforMobile,
} from "./ConversationInfor";
import LogoPage from "../../assets/Logo2.png";

export interface IPropConversationList {
  // Active Link or not
  to?: boolean;
}

const ConversationList: FC<IPropConversationList> = ({ to }) => {
  const [active, setActive] = useState(0);

  const handleActive = (idx: number) => {
    setActive(idx);
  };

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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((element) => (
          <>
            <Link
              to={to ? "/conversation/1" : "#"}
              key={`${element}1`}
              className={`block sm:hidden md:block cursor-pointer ${
                element === active && "bg-white"
              }`}
              onClick={() => handleActive(element)}
            >
              <ConversationInfor
                active={element === active}
                avatarUrl={
                  "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1"
                }
                nickName={"Hoang Dat"}
                status={"Active"}
                lastMessage={"What are you doing?"}
              />
            </Link>
            <div
              key={`${element}10`}
              className={`hidden sm:block md:hidden cursor-pointer ${
                element === active && "bg-white"
              } w-full border-b-[2px] border-[#e8ebed]`}
              onClick={() => handleActive(element)}
            >
              <div className='flex justify-center'>
                <ConversationInforMobile
                  avatarUrl={
                    "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-avatar-dep-anh-dai-dien-FB-Tiktok-Zalo.jpg?ssl=1"
                  }
                />
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
