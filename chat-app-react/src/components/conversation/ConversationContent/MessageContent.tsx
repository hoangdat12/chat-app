import { useEffect, useRef, useState } from 'react';
import Message from '../../message/Message';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { selectConversation } from '../../../features/conversation/conversationSlice';
import {
  addMessage,
  selectMessage,
} from '../../../features/message/messageSlice';
import MessageBoxGroup from '../../message/MessageUserBox';
import { messageService } from '../../../features/message/messageService';
import { MessageType } from '../../../ultils/constant/message.constant';

const MessageContent = () => {
  const [currentPageOfMessage, setCurrentPageOfMessage] = useState<number>(1);
  const [endMessage, setEndMessage] = useState<boolean>(false);
  const { conversationId } = useParams();
  const { conversations } = useAppSelector(selectConversation);
  const conversation = conversations.get(conversationId ?? '');
  const { messages } = useAppSelector(selectMessage);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleScroll = async () => {
    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      const { scrollTop, scrollHeight, clientHeight } = sidebarElement;
      if (scrollTop + scrollHeight <= clientHeight && !endMessage) {
        setCurrentPageOfMessage((prevPage) => prevPage + 1);
        const res = await messageService.fetchMessageOfConversation(
          conversationId,
          currentPageOfMessage + 1
        );
        if (!res.length) {
          setEndMessage(true);
        }
        dispatch(addMessage(res));
      }
    }
  };

  useEffect(() => {
    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages]);

  return (
    <div
      ref={sidebarRef}
      className='max-h-[calc(100vh-13rem)] sm:max-h-[calc(100vh-15rem)] w-full mt-1 flex flex-col-reverse h-full px-4 sm:px-6 py-4 overflow-y-scroll'
    >
      {
        // isLoading ? (
        //   <div>
        //     <span className='loading-spinner'></span>
        //   </div>
        // ) :
        conversation?.conversation_type === MessageType.GROUP ? (
          <>
            {messages.map((messageFormat) => {
              return messageFormat.messages.map((message) => (
                <div
                  className={`${messageFormat.myMessage && 'flex justify-end'}`}
                  key={message._id}
                >
                  <MessageBoxGroup
                    isOwn={messageFormat.myMessage}
                    message={message}
                  />
                </div>
              ));
            })}
          </>
        ) : (
          <>
            {messages?.map((fmt, idx) => {
              return (
                <div key={idx}>
                  <Message
                    messages={fmt.messages}
                    myMessage={fmt.myMessage}
                    timeSendMessage={fmt.timeSendMessage}
                  />
                </div>
              );
            })}
          </>
        )
      }
    </div>
  );
};

export default MessageContent;
