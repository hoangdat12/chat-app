import { FC, MouseEventHandler, ReactNode, useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";
import "./conversation.scss";
import ConversationContent from "../../components/message/ConversationContent";
import { Link, Route, Routes } from "react-router-dom";
import useInnerWidth from "../../hooks/useInnterWidth";
import ConversationList from "../../components/message/ConversationList";
import ConversationSetting from "../../components/message/ConversationSetting";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  IConversation,
  fetchConversationOfUser,
  selectConversation,
} from "../../features/conversation/conversationSlice";
import { IUser } from "../../features/auth/authSlice";

export interface IPropButtonRounded {
  icon: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  to?: string;
}

const Conversation = () => {
  const ditpatch = useAppDispatch();
  const { conversations, isLoading } = useAppSelector(selectConversation);

  const [showMoreConversation, setShowMoreConversation] = useState(false);
  const [conversationSelected, setConversationSelected] =
    useState<IConversation>(conversations?.[0]);
  const innerWitdh = useInnerWidth();

  const userJson = localStorage.getItem("user");
  const user = userJson ? (JSON.parse(userJson) as IUser) : null;

  useEffect(() => {
    const fetchListConversationOfUser = async () => {
      await ditpatch(fetchConversationOfUser(user?._id ? user?._id : " "));
    };

    if (!conversations?.length) {
      fetchListConversationOfUser();
    }

    if (conversations?.length && !conversationSelected) {
      setConversationSelected(conversations[0]);
    }
  }, [conversations]);

  return (
    <Layout>
      <div className='relative md:grid md:grid-cols-12 flex w-full h-full overflow-hidden'>
        {innerWitdh < 640 ? (
          <Routes>
            <Route
              path='/'
              element={
                <ConversationList
                  setConversationSelected={setConversationSelected}
                  conversations={conversations}
                  user={user}
                  to={true}
                />
              }
            />
            <Route
              path='/1'
              element={
                <ConversationContent
                  user={user}
                  conversation={conversationSelected}
                />
              }
            />
            <Route path='/setting' element={<ConversationSetting />} />
          </Routes>
        ) : (
          <>
            <ConversationList
              setConversationSelected={setConversationSelected}
              conversations={conversations}
              user={user}
            />
            <ConversationContent
              user={user}
              conversation={conversationSelected}
              setShowMoreConversation={setShowMoreConversation}
              showMoreConversation={showMoreConversation}
            />
            <ConversationSetting
              showMoreConversation={showMoreConversation}
              setShowMoreConversation={setShowMoreConversation}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export const ButtonRounded: FC<IPropButtonRounded> = ({
  icon,
  className,
  onClick,
  to,
}) => {
  return (
    <Link
      to={to ? to : "#"}
      className={`${className} flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer`}
      onClick={onClick ? onClick : undefined}
    >
      {icon}
    </Link>
  );
};

export default Conversation;
