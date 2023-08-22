import {
  IDataReceived,
  IConversation,
  IResponse,
  IDataCreateNewGroup,
  IDataAddNewMember,
  IDataAddNewMemberResponse,
  IDataChangeUsernameOfConversation,
  IDataChangeEmoji,
  IDataChangeNameGroup,
  IDataDeleteMemberResponse,
  IDataDeleteMember,
  IParticipant,
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

const createNewGroup = async (
  data: IDataCreateNewGroup
): Promise<IResponse<IConversation>> => {
  return await myAxios.post('/conversation', data);
};

const handleAddNewMember = async (
  data: IDataAddNewMember
): Promise<IDataAddNewMemberResponse> => {
  const res = await myAxios.post('/conversation/group/participant/add', data);
  return res.data.metaData;
};

const handleDeleteMember = async (
  data: IDataDeleteMember
): Promise<IResponse<IDataDeleteMemberResponse>> => {
  const res = await myAxios.patch(
    '/conversation/group/participant/delele',
    data
  );
  return res;
};

const handlePromotedAdmin = async (
  data: IDataDeleteMember
): Promise<{
  participant: IParticipant;
  conversation: IConversation;
}> => {
  const res = await myAxios.patch(
    '/conversation/group/participant/promoted',
    data
  );
  return res.data.metaData;
};

const handleChangeUsername = async (
  data: IDataChangeUsernameOfConversation
): Promise<IDataChangeUsernameOfConversation> => {
  const res = await myAxios.patch('/conversation/change-username', data);
  return res.data.metaData;
};

const handleChangeEmoji = async (
  data: IDataChangeEmoji
): Promise<IConversation> => {
  const res = await myAxios.patch('/conversation/change-emoji', data);
  return res.data.metaData;
};

const handleChangeAvatarOfGroup = async (
  data: FormData
): Promise<IResponse<IConversation>> => {
  const res = await myAxios.patch('/conversation/change-avatar-group', data);
  return res;
};

const handleChangeNameOfGroup = async (
  data: IDataChangeNameGroup
): Promise<IResponse<IConversation>> => {
  const res = await myAxios.patch('/conversation/change-name-group', data);
  return res;
};

const handleDeleteConversation = async (
  conversationId: string
): Promise<IConversation> => {
  const res = await myAxios.delete(`/conversation/${conversationId}`);
  return res.data.metaData;
};

const handleLeaveGroup = async (
  conversationId: string
): Promise<IConversation> => {
  const res = await myAxios.patch(
    `/conversation/group/participant/leave/${conversationId}`
  );
  return res.data.metaData;
};

const findMatchConversation = async (
  userId?: string
): Promise<IResponse<IConversation>> => {
  const res = await myAxios.get(`/conversation/match/${userId}`);
  return res;
};

const changeNotification = async (
  conversationId: string
): Promise<IResponse<{ receiveNotification: boolean }>> => {
  const res = await myAxios.post(
    `/conversation/change/notification/${conversationId}`
  );
  return res;
};

const getAllGroupOfUser = async (
  userId: string
): Promise<IResponse<IConversation[]>> => {
  const res = await myAxios.get(`/conversation/group/${userId}`);
  return res;
};

const findGroupByKeyword = async (
  userId: string,
  keyword: string
): Promise<IResponse<IConversation[]>> => {
  const res = await myAxios.get(
    `/conversation/group/search/${userId}?search=${keyword}`
  );
  return res;
};

export const conversationService = {
  fetchConversationOfUser,
  searchConversationByName,
  getFirstConversation,
  createNewGroup,
  handleAddNewMember,
  handlePromotedAdmin,
  handleDeleteMember,
  handleChangeUsername,
  handleChangeEmoji,
  handleChangeAvatarOfGroup,
  handleChangeNameOfGroup,
  handleDeleteConversation,
  handleLeaveGroup,
  findMatchConversation,
  changeNotification,
  getAllGroupOfUser,
  findGroupByKeyword,
};
