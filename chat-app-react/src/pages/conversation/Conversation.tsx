import { useCallback, useEffect, useState } from 'react';

import Layout from '../../components/layout/Layout';
import './conversation.scss';
import { Route, Routes, useParams } from 'react-router-dom';
import ConversationList from '../../components/conversation/ConversationList';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  fetchConversationOfUser,
  selectConversation,
} from '../../features/conversation/conversationSlice';
import { getUserLocalStorageItem, getUserNameAndAvatarUrl } from '../../ultils';
import ConversationContent from '../../components/conversation/ConversationContent/ConversationContent';
import myAxios from '../../ultils/myAxios';
import useInnerWidth from '../../hooks/useInnterWidth';
import ConversationSetting from '../../components/conversation/ConversationSetting';
import { IInforConversation } from '../../components/conversation/ConversationContent/HeaderContent';
import CreateNewGroup from '../../components/modal/CreateNewGroup';
import ChangeNickName from '../../components/modal/ChangeNickName';

const Conversation = () => {
  const ditpatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);
  const [showListConversationSM, setShowListConversationSM] = useState(false);
  const [isShowAddNewMember, setIsShowAddNewMember] = useState(false);
  const [isShowChangeUsername, setIsShowChangeUsername] = useState(false);

  const innerWitdh = useInnerWidth();
  const user = getUserLocalStorageItem();
  const { conversationId } = useParams();
  const conversation = conversations.get(conversationId ?? '');

  const getInforChatFromConversation = useCallback(getUserNameAndAvatarUrl, [
    conversation,
  ]);
  const { userName, status, avatarUrl } = getInforChatFromConversation(
    user,
    conversation
  ) as IInforConversation;

  // Show list conversation with reponsive for sm
  const handleShowListConversation = () => {
    setShowListConversationSM(!showListConversationSM);
  };

  const handleAddNewMember = () => {
    setIsShowAddNewMember(true);
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
                  <ConversationContent
                    user={user}
                    isShowAddNewMember={isShowAddNewMember}
                    setIsShowAddNewMember={setIsShowAddNewMember}
                    setIsShowChangeUsername={setIsShowChangeUsername}
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
              isShowAddNewMember={isShowAddNewMember}
              setIsShowAddNewMember={setIsShowAddNewMember}
              setIsShowChangeUsername={setIsShowChangeUsername}
            />

            <ConversationSetting
              userName={userName}
              avatarUrl={avatarUrl}
              status={status}
              conversation={conversation}
              handleAddNewMember={handleAddNewMember}
              setIsShowChangeUsername={setIsShowChangeUsername}
            />
          </>
        )}
        <CreateNewGroup
          isShowCreateNewGroup={isShowAddNewMember}
          setShowCreateNewGroup={setIsShowAddNewMember}
          type={'add'}
        />
        <ChangeNickName
          conversation={conversation}
          isShow={isShowChangeUsername}
          setIsShow={setIsShowChangeUsername}
        />
      </div>
    </Layout>
  );
};

export default Conversation;
