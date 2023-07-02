import {
  IDataReceived,
  IConversation,
  IResponse,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

export interface IDataConversations {
  conversations: IConversation[];
}

const fetchConversationOfUser = async (userId: string) => {
  const res = (await myAxios.get(
    `/user/conversation/${userId}`
  )) as IDataReceived<IDataConversations>;
  return res.data.metaData;
};

const searchConversationByName = async (
  keyword: string
): Promise<IResponse<IConversation[]>> => {
  const res = await myAxios.get(`/conversation/search?q=${keyword}`);
  return res;
};

export const conversationService = {
  fetchConversationOfUser,
  searchConversationByName,
};
