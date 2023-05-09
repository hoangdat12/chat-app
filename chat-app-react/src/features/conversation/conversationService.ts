import myAxios from "../../ultils/myAxios";
import { IConversation } from "./conversationSlice";

export interface IIConversationData {
  data: {
    metaData: {
      conversations: IConversation[];
    };
    message: string;
    status: number;
  };
}

const fetchConversationOfUser = async (userId: string) => {
  const res = (await myAxios.get(
    `http://localhost:8080/api/v1/user/conversation/${userId}`
  )) as IIConversationData;
  return res.data.metaData;
};

export const conversationService = {
  fetchConversationOfUser,
};
