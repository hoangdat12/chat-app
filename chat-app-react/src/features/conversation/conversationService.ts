import { IDataReceived, IConversation } from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

export interface IDataConversations {
  conversations: IConversation[];
}

const fetchConversationOfUser = async (userId: string) => {
  const res = (await myAxios.get(
    `http://localhost:8080/api/v1/user/conversation/${userId}`
  )) as IDataReceived<IDataConversations>;
  return res.data.metaData;
};

export const conversationService = {
  fetchConversationOfUser,
};
