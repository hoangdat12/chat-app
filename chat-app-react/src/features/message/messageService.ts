import { getTimeSendMessage, getUserLocalStorageItem } from '../../ultils';
import {
  IAllMessageData,
  IDataCreateMessage,
  IDataDeleteMessageOfConversation,
  IDataFormatMessage,
  IDataReceived,
  IDataUpdateMessageOfConversation,
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
  conversationId: string
): Promise<IDataFormatMessage[]> => {
  const res = (await myAxios.get(
    `conversation/${conversationId}`
  )) as IDataReceived<IAllMessageData>;
  console.log(res);
  if (res.data.status === 200) {
    const formatMessage = messageService.formatMessage(
      res.data.metaData.messages
    );
    return formatMessage;
  } else {
    return [];
  }
};

const createNewMessage = async (data: IDataCreateMessage) => {
  const res = await myAxios.post('/message', data);
  return res;
};

const deleteMessageOfConversation = async (
  data: IDataDeleteMessageOfConversation
) => {
  const res = await myAxios.delete(`message`, { data });
  return res;
};

const updateMessageOfConversation = async (
  data: IDataUpdateMessageOfConversation
) => {
  const res = await myAxios.patch(`message`, data);
  return res;
};

export const messageService = {
  fetchMessageOfConversation,
  formatMessage,
  deleteMessageOfConversation,
  createNewMessage,
  updateMessageOfConversation,
};
