import myAxios from "../../ultils/myAxios";
import { IDataReceived } from "../auth/authService";
import { IAllMessageData } from "./messageSlice";

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
};
