import { FC, MouseEventHandler, ReactNode, useEffect, useState } from 'react';

import Layout from '../../components/layout/Layout';
import './conversation.scss';
import { Link, Route, Routes } from 'react-router-dom';
import useInnerWidth from '../../hooks/useInnterWidth';
import ConversationList from '../../components/conversation/ConversationList';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  fetchConversationOfUser,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem } from '../../ultils';
import { IConversation } from '../../ultils/interface';
import ConversationContent from '../../components/conversation/ConversationContent';
import ConversationSetting from '../../components/conversation/ConversationSetting';

export interface IPropButtonRounded {
  icon: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  to?: string;
}

const Conversation = () => {
  const ditpatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);
  const [showMoreConversation, setShowMoreConversation] = useState(false);
  const [conversationSelected, setConversationSelected] =
    useState<IConversation | null>(null);
  const innerWitdh = useInnerWidth();

  const user = getUserLocalStorageItem();
  useEffect(() => {
    const fetchListConversationOfUser = async () => {
      await ditpatch(fetchConversationOfUser(user?._id ? user?._id : ' '));
    };

    if (!conversations?.size) {
      fetchListConversationOfUser();
    }

    if (conversations?.size && !conversationSelected) {
      setConversationSelected(conversations.values().next().value);
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
              path='/:conversationId'
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
      to={to ? to : '#'}
      className={`${className} flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer`}
      onClick={onClick ? onClick : undefined}
    >
      {icon}
    </Link>
  );
};

export default Conversation;
