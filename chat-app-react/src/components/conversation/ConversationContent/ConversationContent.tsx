import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';

import useInnerWidth from '../../../hooks/useInnterWidth';
import {
  createNewMessageOfConversation,
  deleteLastMessage,
  selectConversation,
  updateLastMessage,
} from '../../../features/conversation/conversationSlice';
import {
  fetchMessageOfConversation as fetchMessage,
  createNewMessage,
  deleteMessage,
} from '../../../features/message/messageSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { SocketContext } from '../../../ultils/context/Socket';
import {
  IConversation,
  IMessage,
  IUser,
  iSocketDeleteMessage,
} from '../../../ultils/interface';
import { messageService } from '../../../features/message/messageService';
import { useParams } from 'react-router-dom';
import HeaderContent, { IInforConversation } from './HeaderContent';
import InputSendMessage from './InputSendMessage';
import MessageContent from './MessageContent';
import ConversationSetting from '../ConversationSetting';
import { MessageContentType } from '../../../ultils/constant/message.constant';
import { getUserNameAndAvatarUrl } from '../../../ultils';

export interface IPropConversationContent {
  user: IUser | null;
  handleShowListConversation?: () => void;
  showListConversationSM?: boolean;
  isShowAddNewMember: boolean;
  setIsShowAddNewMember: (value: boolean) => void;
  setIsShowChangeUsername: (value: boolean) => void;
}

const ConversationContent: FC<IPropConversationContent> = ({
  user,
  handleShowListConversation,
  showListConversationSM,
  setIsShowAddNewMember,
  setIsShowChangeUsername,
}) => {
  const [messageValue, setMessageValue] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [fileImageMessage, setFileImageMessage] = useState<FileList | null>(
    null
  );
  const [showMoreConversation, setShowMoreConversation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const innterWidth = useInnerWidth();
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const { conversationId } = useParams();
  const { conversations } = useAppSelector(selectConversation);
  const conversation = conversations.get(conversationId ?? '') as IConversation;

  const getInforChatFromConversation = useCallback(getUserNameAndAvatarUrl, [
    conversation,
  ]);
  const { userName, status, avatarUrl } = getInforChatFromConversation(
    user,
    conversation
  ) as IInforConversation;

  // Show modal add new Member
  const handleAddNewMember = () => {
    setIsShowAddNewMember(true);
    setShowMoreConversation(false);
  };

  // Send message
  const handleSendMessage = async () => {
    if (conversation) {
      if (messageValue.trim() !== '') {
        const body = {
          message_type: conversation?.conversation_type,
          message_content: messageValue,
          conversationId: conversation?._id,
          participants: conversation.participants,
          message_content_type: MessageContentType.MESSAGE,
        };
        const res = await messageService.createNewMessage(body);
        if (res.status === 201) {
          dispatch(createNewMessage(res.data.metaData));
          const dataUpdate = {
            lastMessage: res.data.metaData,
            conversationId: conversation?._id,
          };
          dispatch(createNewMessageOfConversation(dataUpdate));
        }
      }
      if (fileImageMessage?.length) {
        for (let file of fileImageMessage) {
          const formData = new FormData();
          formData.append('file', file);
          const body = {
            message_type: conversation?.conversation_type,
            message_content: messageValue,
            conversationId: conversation?._id,
            participants: conversation.participants,
            message_content_type: MessageContentType.IMAGE,
          };
          formData.append('body', JSON.stringify(body));
          console.log(formData);
          const res = await messageService.createNewMessageImage(formData);
          console.log(res);
          if (res.status === 201) {
            dispatch(createNewMessage(res.data.metaData));
            const dataUpdate = {
              lastMessage: res.data.metaData,
              conversationId: conversation?._id,
            };
            dispatch(createNewMessageOfConversation(dataUpdate));
          }
        }
      }
      setImages([]);
      setFileImageMessage(null);
      setMessageValue('');
      inputRef.current?.focus();
    }
  };

  // Show more conversation
  const handleShowMoreConversation = () => {
    if (setShowMoreConversation && innterWidth < 1280) {
      setShowMoreConversation(!showMoreConversation);
    }
  };

  // Socket received message created
  const handleSocketCreateMessage = (payload: IMessage) => {
    const { message_sender_by, message_conversation } = payload;
    if (message_sender_by.userId === user?._id) {
      return;
    }
    const dataUpdate = {
      lastMessage: payload,
      conversationId: message_conversation,
    };
    dispatch(createNewMessageOfConversation(dataUpdate));
    if (message_conversation !== conversationId) {
      return;
    }
    dispatch(createNewMessage(payload));
  };

  // Socket received message updated
  const handleSocketUpdateMessage = (payload: any) => {
    const { message_sender_by, message_conversation, message_received } =
      payload;
    if (message_sender_by.userId === user?._id) {
      return;
    }
    if (message_conversation !== conversationId) {
      return;
    }
    for (let received of message_received) {
      if (received.userId === user?._id) {
        dispatch(
          updateLastMessage({
            conversationId: conversationId,
            lastMessage: payload,
          })
        );
        return;
      }
    }
  };

  // Socket received message deleted
  const handleSocketDeleteMessage = (payload: iSocketDeleteMessage) => {
    const { message, lastMessage } = payload;
    const { message_sender_by, message_conversation, message_received } =
      message;
    if (message_sender_by.userId === user?._id) {
      return;
    }
    if (message_conversation !== conversationId) {
      return;
    }
    for (let received of message_received) {
      if (received.userId === user?._id) {
        dispatch(deleteMessage(message));
        dispatch(
          deleteLastMessage({
            conversationId: message_conversation,
            lastMessage,
          })
        );
        return;
      }
    }
  };

  // Handle event Enter
  useEffect(() => {
    if (messageValue !== '') {
      const enterEvent = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          handleSendMessage();
        }
      };

      document.addEventListener('keydown', enterEvent);

      return () => {
        document.removeEventListener('keydown', enterEvent);
      };
    }
  }, [messageValue]);

  // Get message of conversation
  useEffect(() => {
    if (conversation) {
      const data = {
        conversationId,
      };
      dispatch(fetchMessage(data));
    }
  }, [conversation]);

  useEffect(() => {
    socket.on('connection', (data) => {
      console.log(data);
    });
    socket.on('onMessage', handleSocketCreateMessage);
    socket.on('onMessageUpdate', handleSocketUpdateMessage);
    socket.on('onMessageDelete', handleSocketDeleteMessage);
    return () => {
      socket.off('connection');
      socket.off('onMessage');
      socket.off('onMessageUpdate');
      socket.off('onMessageDelete');
    };
  }, []);

  return (
    <div className='block xl:col-span-6 md:col-span-8 w-full h-full'>
      <HeaderContent
        handleShowMoreConversation={handleShowMoreConversation}
        handleShowListConversation={handleShowListConversation}
        showListConversationSM={showListConversationSM}
        userName={userName}
        avatarUrl={avatarUrl}
        status={status}
      />

      <MessageContent />

      <InputSendMessage
        inputRef={inputRef}
        messageValue={messageValue}
        setMessageValue={setMessageValue}
        handleSendMessage={handleSendMessage}
        images={images}
        setImages={setImages}
        files={fileImageMessage}
        setFiles={setFileImageMessage}
      />

      <ConversationSetting
        showMoreConversation={showMoreConversation}
        setShowMoreConversation={setShowMoreConversation}
        userName={userName}
        avatarUrl={avatarUrl}
        status={status}
        conversation={conversation}
        handleAddNewMember={handleAddNewMember}
        setIsShowChangeUsername={setIsShowChangeUsername}
      />
    </div>
  );
};

export default ConversationContent;
