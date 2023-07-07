import { FC, MouseEventHandler, ReactNode, useEffect, useState } from 'react';

import Layout from '../../components/layout/Layout';
import './conversation.scss';
import { Link, Route, Routes } from 'react-router-dom';
import ConversationList from '../../components/conversation/ConversationList';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  fetchConversationOfUser,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem } from '../../ultils';
import ConversationContent from '../../components/conversation/ConversationContent/ConversationContent';
import myAxios from '../../ultils/myAxios';
import useInnerWidth from '../../hooks/useInnterWidth';

export interface IPropButtonRounded {
  icon: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  to?: string;
}

const Conversation = () => {
  const ditpatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);
  const [showListConversationSM, setShowListConversationSM] = useState(false);

  const innerWitdh = useInnerWidth();
  const user = getUserLocalStorageItem();

  // Show list conversation with reponsive for sm
  const handleShowListConversation = () => {
    setShowListConversationSM(!showListConversationSM);
  };

  // isReadLastMessage = true
  const handleSelectConversation = async (conversationId: string) => {
    await myAxios.post('/conversation/read-last-message', {
      conversationId,
    });
  };

  useEffect(() => {
    const fetchListConversationOfUser = async () => {
      await ditpatch(fetchConversationOfUser(user?._id ? user?._id : ' '));
    };

    if (!conversations?.size) {
      fetchListConversationOfUser();
    }
  }, [conversations]);

  return (
    <Layout>
      <div className='relative md:grid md:grid-cols-12 flex w-full h-full overflow-hidden'>
        {innerWitdh < 640 ? (
          <Routes>
            <Route
              path='/list'
              element={
                <ConversationList
                  handleSelectConversation={handleSelectConversation}
                  conversations={conversations}
                  user={user}
                  to={true}
                />
              }
            />
            <Route
              path='/'
              element={
                <>
                  <ConversationContent user={user} />
                </>
              }
            />
          </Routes>
        ) : (
          <>
            <ConversationList
              handleSelectConversation={handleSelectConversation}
              conversations={conversations}
              user={user}
              showListConversationSM={showListConversationSM}
            />
            <ConversationContent
              user={user}
              handleShowListConversation={handleShowListConversation}
              showListConversationSM={showListConversationSM}
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
