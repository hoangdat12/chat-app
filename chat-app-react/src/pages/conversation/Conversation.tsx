import { useCallback, useEffect, useState } from 'react';

import Layout from '../../components/layout/Layout';
import './conversation.scss';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import ConversationList from '../../components/conversation/ConversationList';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  createFakeConversation,
  fetchConversationOfUser,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem } from '../../ultils';
import ConversationContent from '../../components/conversation/ConversationContent/ConversationContent';
import myAxios from '../../ultils/myAxios';
import useInnerWidth from '../../hooks/useInnterWidth';
import ConversationSetting from '../../components/conversation/ConversationSetting';
import { IConversation } from '../../ultils/interface';
import NoConversation from '../../components/conversation/NoConversation';
import { MessageType } from '../../ultils/constant';

const Conversation = () => {
  const [showListConversationSM, setShowListConversationSM] = useState(false);
  const [showMoreConversation, setShowMoreConversation] = useState(false);
  const [conversation, setConversation] = useState<IConversation>();
  const dispatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);

  const innerWitdh = useInnerWidth();
  const user = getUserLocalStorageItem();
  const { conversationId } = useParams();
  const location = useLocation();

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

  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state?.fakeConversation) {
      dispatch(createFakeConversation(location.state.fakeConversation));
      navigate('.', { state: null });
    }
  }, [location]);

  useEffect(() => {
    const foundConversation = conversations.get(conversationId ?? '');
    if (foundConversation) {
      setConversation(foundConversation);
    }
  }, [conversationId]);

  return (
    <Layout>
      {conversations.size === 0 && !conversationId ? (
        <NoConversation />
      ) : (
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
                      isValidSendMessage={
                        conversation?.conversation_type === MessageType.GROUP
                          ? isValid
                          : true
                      }
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
                isValidSendMessage={
                  conversation?.conversation_type === MessageType.GROUP
                    ? isValid
                    : true
                }
              />
              {conversation && (
                <ConversationSetting
                  showMoreConversation={showMoreConversation}
                  setShowMoreConversation={setShowMoreConversation}
                  conversation={conversation}
                  isValidSendMessage={
                    conversation?.conversation_type === MessageType.GROUP
                      ? isValid
                      : true
                  }
                />
              )}
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Conversation;
