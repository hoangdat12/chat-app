import {
  IDataReceived,
  IConversation,
  IResponse,
  IDataCreateNewGroup,
  IDataAddNewMember,
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

const getFirstConversation = async (): Promise<IConversation> => {
  const res = await myAxios.get(`/conversation/first`);
  return res.data.metaData;
};

const createNewGroup = async (data: IDataCreateNewGroup) => {
  return await myAxios.post('/conversation', data);
};

const handleAddNewMember = async (
  data: IDataAddNewMember
): Promise<IConversation> => {
  const res = await myAxios.post('/conversation/group/participant/add', data);
  console.log(res);
  return res.data.metaData;
};

export const conversationService = {
  fetchConversationOfUser,
  searchConversationByName,
  getFirstConversation,
  createNewGroup,
  handleAddNewMember,
};
