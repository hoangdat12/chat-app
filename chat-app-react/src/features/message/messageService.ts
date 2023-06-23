import myAxios from "../../ultils/myAxios";
import { IDataReceived } from "../auth/authService";
import { IUser } from "../auth/authSlice";
import { IParticipant } from "../conversation/conversationSlice";
import { IAllMessageData, IMessage } from "./messageSlice";

export interface IDataFormatMessage {
  user: IParticipant;
  messages: IMessage[];
  myMessage: boolean;
}

const formatMessage = (messages: IMessage[], user: IUser | null) => {
  const formatMessage: IDataFormatMessage[] = [];
  if (messages?.length) {
    let currentUser = messages[0].message_sender_by;
    let messageOfUser: IMessage[] = [messages[0]];

    for (let i = 1; i < messages.length; i++) {
      const lastUser = messages[i]?.message_sender_by;
      const { userId } = currentUser || {};

      if (userId === lastUser?.userId) {
        messageOfUser.push(messages[i]);
      } else {
        const data: IDataFormatMessage = {
          user: currentUser,
          messages: messageOfUser,
          myMessage: user?._id === userId,
        };
        formatMessage.push(data);
        currentUser = messages[i]?.message_sender_by;
        messageOfUser = [messages[i]];
      }
    }
    const { userId } = currentUser || {};
    const data: IDataFormatMessage = {
      user: currentUser,
      messages: messageOfUser,
      myMessage: user?._id === userId,
    };
    formatMessage.push(data);
  }
  return formatMessage;
};

const fetchMessageOfConversation = async (
  conversation_type: string,
  conversationId: string
) => {
  const res = (await myAxios.get(
    `conversation/${conversation_type}/${conversationId}`
  )) as IDataReceived<IAllMessageData>;
  if (res.data.status === 200) {
    return res.data.metaData;
  } else {
    const response: IAllMessageData = {
      limit: 0,
      page: 0,
      sortedBy: "ctime",
      messages: [],
    };
    return response;
  }
};

export const messageService = {
  fetchMessageOfConversation,
  formatMessage,
};
