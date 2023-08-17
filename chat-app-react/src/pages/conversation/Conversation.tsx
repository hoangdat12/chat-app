import { useCallback, useEffect, useState } from 'react';

import Layout from '../../components/layout/Layout';
import './conversation.scss';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import ConversationList from '../../components/conversation/ConversationList';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  createFakeConversation,
  fetchConversationOfUser,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem, getUserNameAndAvatarUrl } from '../../ultils';
import ConversationContent from '../../components/conversation/ConversationContent/ConversationContent';
import myAxios from '../../ultils/myAxios';
import useInnerWidth from '../../hooks/useInnterWidth';
import ConversationSetting from '../../components/conversation/ConversationSetting';
import { IInforConversation } from '../../components/conversation/ConversationContent/HeaderContent';
import { IConversation } from '../../ultils/interface';

const Conversation = () => {
  const [showListConversationSM, setShowListConversationSM] = useState(false);
  const [showMoreConversation, setShowMoreConversation] = useState(false);
  const dispatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);

  const innerWitdh = useInnerWidth();
  const user = getUserLocalStorageItem();
  const { conversationId } = useParams();
  const location = useLocation();
  const conversation = conversations.get(conversationId ?? '');

  const getInforChatFromConversation = useCallback(getUserNameAndAvatarUrl, [
    conversation,
  ]);
  const { userName, status, avatarUrl } = getInforChatFromConversation(
    user,
    conversation
  ) as IInforConversation;

  const userPermissionChat = useCallback(
    (userId: string | undefined, conversation: IConversation | undefined) => {
      if (userId && conversation) {
        for (let participant of conversation.participants) {
          if (participant.userId === userId && participant.enable) {
            return true;
          }
        }
        return false;
      } else return false;
    },
    [conversationId]
  );
  const isValid = userPermissionChat(user?._id, conversation);

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
      await dispatch(fetchConversationOfUser(user?._id ? user?._id : ' '));
    };

    fetchListConversationOfUser();
  }, []);

  useEffect(() => {
    if (location?.state?.fakeConversation) {
      dispatch(createFakeConversation(location.state.fakeConversation));
      location.state.fakeConversation = undefined;
    }
  }, [location]);

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
                  <ConversationContent
                    user={user}
                    showMoreConversation={showMoreConversation}
                    setShowMoreConversation={setShowMoreConversation}
                  />
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
              showMoreConversation={showMoreConversation}
              setShowMoreConversation={setShowMoreConversation}
            />
            {userName && (
              <ConversationSetting
                userName={userName}
                avatarUrl={avatarUrl}
                status={status}
                showMoreConversation={showMoreConversation}
                setShowMoreConversation={setShowMoreConversation}
                conversation={conversation}
                isValidSendMessage={isValid}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Conversation;
