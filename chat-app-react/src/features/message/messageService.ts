import { getTimeSendMessage, getUserLocalStorageItem } from '../../ultils';
import {
  IAllMessageData,
  IDataFormatMessage,
  IDataReceived,
  IMessage,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const formatMessage = (messages: IMessage[]): IDataFormatMessage[] => {
  const user = getUserLocalStorageItem();

  const formatMessage: IDataFormatMessage[] = [];

  if (messages?.length) {
    let currentUser = messages[0].message_sender_by;
    let messageOfUser: IMessage[] = [messages[0]];
    let currentTime = messages[0].createdAt;

    for (let i = 1; i < messages.length; i++) {
      const lastUser = messages[i]?.message_sender_by;
      const { userId } = currentUser || {};

      const condition =
        new Date(currentTime).getTime() -
          new Date(messages[i]?.createdAt).getTime() <
        5 * 1000 * 60;

      if (userId === lastUser?.userId && condition) {
        messageOfUser.push(messages[i]);
      } else {
        const data: IDataFormatMessage = {
          user: currentUser,
          messages: messageOfUser,
          timeSendMessage:
            new Date(messages[i - 1]?.createdAt).getTime() -
              new Date(messages[i]?.createdAt).getTime() <
            5 * 1000 * 60
              ? null
              : getTimeSendMessage(messages[i - 1]?.createdAt),
          myMessage: user?._id === userId,
        };

        formatMessage.push(data);

        currentUser = messages[i]?.message_sender_by;
        messageOfUser = [messages[i]];
        currentTime = messages[i].createdAt;
      }
    }

    // last message
    const { userId } = currentUser || {};
    const data: IDataFormatMessage = {
      user: currentUser,
      messages: messageOfUser,
      timeSendMessage: getTimeSendMessage(
        messageOfUser[messageOfUser.length - 1]?.createdAt
      ),
      myMessage: user?._id === userId,
    };
    formatMessage.push(data);
  }
  return formatMessage;
};

const fetchMessageOfConversation = async (
  conversation_type: string,
  conversationId: string
): Promise<IDataFormatMessage[]> => {
  const res = (await myAxios.get(
    `conversation/${conversation_type}/${conversationId}`
  )) as IDataReceived<IAllMessageData>;
  if (res.data.status === 200) {
    const formatMessage = messageService.formatMessage(
      res.data.metaData.messages
    );
    return formatMessage;
  } else {
    return [];
  }
};

export const messageService = {
  fetchMessageOfConversation,
  formatMessage,
};
