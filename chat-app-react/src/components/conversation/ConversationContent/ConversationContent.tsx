import { FC, useEffect, useRef, useState, useContext } from 'react';

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
import HeaderContent from './HeaderContent';
import InputSendMessage from './InputSendMessage';
import MessageContent from './MessageContent';

export interface IPropConversationContent {
  user: IUser | null;
  setShowMoreConversation?: (value: boolean) => void;
  showMoreConversation?: boolean;
}

const ConversationContent: FC<IPropConversationContent> = ({
  user,
  setShowMoreConversation,
  showMoreConversation,
}) => {
  const [messageValue, setMessageValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const innterWidth = useInnerWidth();
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const { conversationId } = useParams();
  const { conversations } = useAppSelector(selectConversation);
  const conversation = conversations.get(conversationId ?? '') as IConversation;
  const handleSendMessage = async () => {
    if (conversation) {
      const body = {
        message_type: conversation?.conversation_type,
        message_content: messageValue,
        conversationId: conversation?._id,
        participants: conversation.participants,
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
      setMessageValue('');
      inputRef.current?.focus();
    }
  };

  const handleShowMoreConversation = () => {
    if (setShowMoreConversation && innterWidth < 1280 && innterWidth >= 640) {
      setShowMoreConversation(!showMoreConversation);
    }
  };

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
      <HeaderContent handleShowMoreConversation={handleShowMoreConversation} />

      <MessageContent />

      <InputSendMessage
        inputRef={inputRef}
        messageValue={messageValue}
        setMessageValue={setMessageValue}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ConversationContent;
