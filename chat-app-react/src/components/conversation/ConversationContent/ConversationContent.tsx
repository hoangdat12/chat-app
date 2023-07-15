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
  changeAvatarOfConversation,
  changeEmojiOfConversation,
  changeNameOfConversation,
  changeUsernameOfParticipant,
  createConversation,
  createNewMessageOfConversation,
  deleteLastMessage,
  deleteMemberOfGroup,
  leaveGroup,
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
  IDataChangeUsernameOfConversation,
  IDataDeleteMemberResponse,
  IDataUserLeaveGroupResponse,
  IMessage,
  IUser,
  iSocketDeleteMessage,
} from '../../../ultils/interface';
import { messageService } from '../../../features/message/messageService';
import { useParams } from 'react-router-dom';
import HeaderContent, { IInforConversation } from './HeaderContent';
import InputSendMessage from './InputSendMessage';
import MessageContent from './MessageContent';
import { MessageContentType } from '../../../ultils/constant/message.constant';
import { getUserNameAndAvatarUrl } from '../../../ultils';
import ConversationSetting from '../ConversationSetting';

export interface IPropConversationContent {
  user: IUser | null;
  handleShowListConversation?: () => void;
  showListConversationSM?: boolean;
  showMoreConversation: boolean;
  setShowMoreConversation: (value: boolean) => void;
}

const ConversationContent: FC<IPropConversationContent> = ({
  user,
  handleShowListConversation,
  showListConversationSM,
  showMoreConversation,
  setShowMoreConversation,
}) => {
  const [messageValue, setMessageValue] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [fileImageMessage, setFileImageMessage] = useState<FileList | null>(
    null
  );
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
  const innerWitdh = useInnerWidth();

  const userPermissionChat = useCallback(
    (userId: string | undefined, conversation: IConversation | undefined) => {
      if (userId && conversation) {
        for (let participant of conversation?.participants) {
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

  // Socket received create new group
  const handleCreateConversation = (payload: IConversation) => {
    dispatch(createConversation(payload));
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
          const res = await messageService.createNewMessageImage(formData);
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

  const handleSendEmoji = async (emoji: any) => {
    const body = {
      message_type: conversation?.conversation_type,
      message_content: emoji,
      conversationId: conversation?._id,
      participants: conversation.participants,
      message_content_type: MessageContentType.EMOJI,
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

  // Socket received delete member userName of participant
  const handleDeleteMember = (payload: IDataDeleteMemberResponse) => {
    dispatch(deleteMemberOfGroup(payload));
  };

  // Socket received change userName of participant
  const handleChangeUsernameOfParticipant = (
    payload: IDataChangeUsernameOfConversation
  ) => {
    dispatch(changeUsernameOfParticipant(payload));
  };

  // Socket received change emoji of participant
  const handleChangeEmoji = (payload: IConversation) => {
    dispatch(changeEmojiOfConversation(payload));
  };

  // Socket received change avatar of participant
  const handleChangeAvatar = (payload: IConversation) => {
    dispatch(changeAvatarOfConversation(payload));
  };

  // Socket received change name group
  const handleChangeNameGroup = (payload: IConversation) => {
    dispatch(changeNameOfConversation(payload));
  };

  // Socket received user leave group
  const handleUserLeaveGroup = (payload: IDataUserLeaveGroupResponse) => {
    dispatch(leaveGroup(payload));
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

    socket.on('createConversation', handleCreateConversation);

    socket.on('onDeleteMemberOfGroup', handleDeleteMember);
    socket.on('onUserLeaveGroup', handleUserLeaveGroup);

    socket.on(
      'onChangeUsernameOfConversation',
      handleChangeUsernameOfParticipant
    );
    socket.on('onChangeEmojiOfConversation', handleChangeEmoji);
    socket.on('onChangeAvatarOfGroup', handleChangeAvatar);
    socket.on('onChangeNameGroup', handleChangeNameGroup);

    return () => {
      socket.off('connection');
      socket.off('onMessage');
      socket.off('onMessageUpdate');
      socket.off('onMessageDelete');
      socket.off('onUserLeaveGroup');
      socket.off('onChangeUsernameOfConversation');
      socket.off('onChangeEmojiOfConversation');
      socket.off('onChangeAvatarOfGroup');
      socket.off('onChangeNameGroup');
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
        handleSendEmoji={handleSendEmoji}
        conversation={conversation}
        setMessageValue={setMessageValue}
        images={images}
        setImages={setImages}
        files={fileImageMessage}
        setFiles={setFileImageMessage}
        isValidSendMessage={isValid}
      />

      {innerWitdh < 640 && userName && (
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
    </div>
  );
};

export default ConversationContent;
