import { FC, memo } from 'react';
import { IDataFormatMessage } from '../../../ultils/interface';
import Message, { UserBox } from '../../message/Message';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../app/hook';
import { selectConversation } from '../../../features/conversation/conversationSlice';
import { selectMessage } from '../../../features/message/messageSlice';

export interface IPropContent {
  messages: IDataFormatMessage[];
  messageType: string | undefined;
}

const MessageContent = () => {
  const { conversationId } = useParams();
  const { conversations } = useAppSelector(selectConversation);
  const conversation = conversations.get(conversationId ?? '');
  const { messages, isLoading } = useAppSelector(selectMessage);
  return (
    <div className='max-h-[calc(100vh-13rem)] sm:max-h-[calc(100vh-15rem)] w-full mt-1 flex flex-col-reverse h-full px-4 sm:px-6 py-4 overflow-y-scroll'>
      {isLoading ? (
        <div>
          <span className='loading-spinner'></span>
        </div>
      ) : conversation?.conversation_type === 'group' ? (
        <ContentGroup
          messages={messages}
          messageType={conversation?.conversation_type}
        />
      ) : (
        <Content
          messages={messages}
          messageType={conversation?.conversation_type}
        />
      )}
    </div>
  );
};

export const Content: FC<IPropContent> = memo(({ messages, messageType }) => {
  return (
    <>
      {messages?.map((fmt, idx) => {
        return (
          <div key={idx}>
            <Message
              messages={fmt.messages}
              myMessage={fmt.myMessage}
              timeSendMessage={fmt.timeSendMessage}
              messageType={messageType}
            />
          </div>
        );
      })}
    </>
  );
});

export const ContentGroup: FC<IPropContent> = memo(({ messages }) => {
  return (
    <>
      {messages.map((messageFormat) => {
        return messageFormat.messages.map((message) => (
          <div key={message._id}>
            <UserBox isOwn={messageFormat.myMessage} message={message} />
          </div>
        ));
      })}
    </>
  );
});

export default MessageContent;
