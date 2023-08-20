import { FC, memo } from 'react';
import { IoIosMore } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { IMessage } from '../../ultils/interface';
import {
  deleteLastMessage,
  selectConversation,
  updateLastMessage,
} from '../../features/conversation/conversationSlice';
import {
  deleteMessage,
  updateMessage,
} from '../../features/message/messageSlice';
import { messageService } from '../../features/message/messageService';
import { convertMessageObjectIdToString } from '../../ultils';
import { MessageContentType } from '../../ultils/constant/message.constant';
import useEnterListener from '../../hooks/useEnterEvent';

export interface IPropOptionMessage {
  showItem: boolean;
  isOwn: boolean;
  setShowItem: (value: string) => void;
  message: IMessage;
  activeUpdateMessageChange: (value: IMessage) => void;
  updateMessageValue: string;
  setUpdateMessage: (value: boolean) => void;
}

const OptionMessage: FC<IPropOptionMessage> = memo(
  ({
    showItem,
    isOwn,
    setShowItem,
    message,
    activeUpdateMessageChange,
    updateMessageValue,
    setUpdateMessage,
  }) => {
    const dispatch = useAppDispatch();
    const { conversations } = useAppSelector(selectConversation);

    const handleDeleteMessage = async (message: IMessage) => {
      const conversation = conversations.get(message.message_conversation);
      if (conversation) {
        dispatch(deleteMessage(message));
        const data = {
          message_id: message._id,
          conversation_type: conversation?.conversation_type,
          conversationId: message.message_conversation,
        };
        const response = await messageService.deleteMessageOfConversation(data);
        if (
          conversation.lastMessage &&
          conversation?.lastMessage._id === message._id
        ) {
          const payload = {
            conversationId: conversation._id,
            lastMessage: convertMessageObjectIdToString(
              response?.data?.metaData?.lastMessage
            ),
          };
          dispatch(deleteLastMessage(payload));
        }
        setShowItem('');
      }
    };

    const handleEditMessage = async (
      message: IMessage
    ): Promise<IMessage | null> => {
      const conversation = conversations.get(message.message_conversation);
      if (conversation) {
        dispatch(updateMessage(message));
        const data = {
          message_id: message._id,
          conversation_type: conversation?.conversation_type,
          conversationId: message.message_conversation,
          message_content: message.message_content,
        };
        const messageUpdate = await messageService.updateMessageOfConversation(
          data
        );
        setShowItem('');
        // update if delete or update last message
        if (conversation?.lastMessage?._id === message._id) {
          const payload = {
            conversationId: conversation._id,
            lastMessage: message,
          };
          dispatch(updateLastMessage(payload));
        }
        return messageUpdate.data.metaData;
      } else return null;
    };

    const handleUpdateMessage = async () => {
      if (updateMessageValue !== message.message_content) {
        const { message_content, ...payload } = message;
        const updateMessage = await handleEditMessage({
          ...payload,
          message_content: updateMessageValue,
        });
        if (updateMessage) {
          setUpdateMessage(false);
        }
      } else {
        setUpdateMessage(false);
      }
    };

    useEnterListener(handleUpdateMessage, updateMessageValue);

    return (
      <>
        <button
          className={`${
            showItem ? 'block' : 'hidden'
          } show-button-more cursor-pointer p-2`}
          onClick={() => {
            setShowItem(message._id);
          }}
        >
          <IoIosMore />
        </button>

        <div
          className={`absolute left-[50%] -translate-x-1/2 ${
            showItem ? 'flex' : 'hidden'
          } flex-col items-center w-[80px] sm:w-[100px] ${
            isOwn && message.message_content_type !== MessageContentType.IMAGE
              ? 'h-16 sm:h-20 -top-[90px]'
              : '-top-[60px]'
          } bg-white shadow-option-message rounded-md p-1 z-[100]`}
          // ref={modalRef}
        >
          <button
            className='flex items-center justify-center text-sm sm:text-base min-h-[1.875rem] sm:min-h-[2.25rem] w-full hover:bg-slate-200 duration-300 z-10'
            onClick={() => handleDeleteMessage(message)}
          >
            Delete
          </button>

          <button
            className={`${
              isOwn && message.message_content_type !== MessageContentType.IMAGE
                ? 'flex'
                : 'hidden'
            } items-center justify-center text-sm sm:text-base min-h-[1.875rem] sm:min-h-[2.25rem] w-full hover:bg-slate-200 duration-300`}
            onClick={() => activeUpdateMessageChange(message)}
          >
            Edit
          </button>
        </div>
      </>
    );
  }
);

export default OptionMessage;
